import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Building2, Database, Link2, RefreshCw, ShieldCheck, Unplug } from "lucide-react";
import {
  disconnectHubspot,
  getHubspotAuthUrl,
  getHubspotStatus,
  HubspotObjectType,
  HubspotRecord,
  listHubspotRecords,
  syncHubspotNow,
} from "../../../lib/hubspotApi";

type CRMProviderId = "salesforce" | "zoho" | "hubspot";

type CRMConnectionState = {
  provider: CRMProviderId | null;
  connectedAt: string | null;
  lastSyncedAt: string | null;
  portalId: number | null;
};

type HubspotDataState = Record<HubspotObjectType, HubspotRecord[]>;

const EMPTY_HUBSPOT_DATA: HubspotDataState = {
  contacts: [],
  companies: [],
  deals: [],
};

const PROVIDERS: Array<{
  id: CRMProviderId;
  name: string;
  description: string;
  records: string;
}> = [
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Enterprise CRM for opportunities, accounts, and activities.",
    records: "Accounts, Contacts, Leads, Opportunities, Tasks",
  },
  {
    id: "zoho",
    name: "Zoho",
    description: "Affordable and flexible CRM with strong SMB workflows.",
    records: "Leads, Contacts, Accounts, Deals, Calls",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "All-in-one sales and marketing CRM platform.",
    records: "Companies, Contacts, Deals, Notes, Engagements",
  },
];

function getStoragePrefix(orgId: string): string {
  return orgId ? `crm_connection_${orgId}` : "crm_connection_default";
}

function readConnectionState(orgId: string): CRMConnectionState {
  const prefix = getStoragePrefix(orgId);
  const provider = localStorage.getItem(`${prefix}_provider`) as CRMProviderId | null;
  const connectedAt = localStorage.getItem(`${prefix}_connected_at`);
  const lastSyncedAt = localStorage.getItem(`${prefix}_last_synced_at`);
  const portalIdValue = localStorage.getItem(`${prefix}_portal_id`);

  return {
    provider,
    connectedAt,
    lastSyncedAt,
    portalId: portalIdValue ? Number(portalIdValue) : null,
  };
}

function persistConnectionState(orgId: string, state: CRMConnectionState): void {
  const prefix = getStoragePrefix(orgId);

  if (state.provider) {
    localStorage.setItem(`${prefix}_provider`, state.provider);
    localStorage.setItem("crmProvider", state.provider);
    localStorage.setItem("crmConnected", "true");
  } else {
    localStorage.removeItem(`${prefix}_provider`);
    localStorage.removeItem("crmProvider");
    localStorage.setItem("crmConnected", "false");
  }

  if (state.connectedAt) {
    localStorage.setItem(`${prefix}_connected_at`, state.connectedAt);
  } else {
    localStorage.removeItem(`${prefix}_connected_at`);
  }

  if (state.lastSyncedAt) {
    localStorage.setItem(`${prefix}_last_synced_at`, state.lastSyncedAt);
  } else {
    localStorage.removeItem(`${prefix}_last_synced_at`);
  }

  if (state.portalId) {
    localStorage.setItem(`${prefix}_portal_id`, String(state.portalId));
  } else {
    localStorage.removeItem(`${prefix}_portal_id`);
  }

  window.dispatchEvent(new Event("crm-status-changed"));
}

function toText(value: unknown): string {
  if (value === null || value === undefined) return "-";
  const text = String(value).trim();
  return text ? text : "-";
}

function getContactTitle(record: HubspotRecord): string {
  const first = toText(record.properties.firstname);
  const last = toText(record.properties.lastname);
  const name = `${first === "-" ? "" : first} ${last === "-" ? "" : last}`.trim();
  return name || "Unnamed Contact";
}

function getCompanyTitle(record: HubspotRecord): string {
  const name = toText(record.properties.name);
  return name === "-" ? "Unnamed Company" : name;
}

function getDealTitle(record: HubspotRecord): string {
  const name = toText(record.properties.dealname);
  return name === "-" ? "Unnamed Deal" : name;
}

export function CRM() {
  const orgId = localStorage.getItem("userOrganization") || "";

  const [connection, setConnection] = useState<CRMConnectionState>({
    provider: null,
    connectedAt: null,
    lastSyncedAt: null,
    portalId: null,
  });
  const [activeProviderId, setActiveProviderId] = useState<CRMProviderId | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [recordsError, setRecordsError] = useState("");
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [hubspotData, setHubspotData] = useState<HubspotDataState>(EMPTY_HUBSPOT_DATA);

  const loadHubspotRecords = useCallback(async () => {
    setIsLoadingRecords(true);
    setRecordsError("");

    try {
      const [contacts, companies, deals] = await Promise.all([
        listHubspotRecords("contacts", 15),
        listHubspotRecords("companies", 15),
        listHubspotRecords("deals", 15),
      ]);

      setHubspotData({
        contacts: contacts.records,
        companies: companies.records,
        deals: deals.records,
      });
    } catch (error) {
      setRecordsError(error instanceof Error ? error.message : "Failed to load synced HubSpot records.");
      setHubspotData(EMPTY_HUBSPOT_DATA);
    } finally {
      setIsLoadingRecords(false);
    }
  }, []);

  useEffect(() => {
    const loadConnection = async () => {
      setIsLoadingStatus(true);
      setErrorMessage("");

      const localState = readConnectionState(orgId);
      setConnection(localState);

      try {
        const status = await getHubspotStatus();
        if (status.connected) {
          const nextState: CRMConnectionState = {
            provider: "hubspot",
            connectedAt: status.connectedAt || null,
            lastSyncedAt: status.lastSyncedAt || null,
            portalId: status.portalId || null,
          };
          setConnection(nextState);
          persistConnectionState(orgId, nextState);
          await loadHubspotRecords();
          return;
        }

        if (localState.provider === "hubspot") {
          const disconnectedState: CRMConnectionState = {
            provider: null,
            connectedAt: null,
            lastSyncedAt: null,
            portalId: null,
          };
          setConnection(disconnectedState);
          persistConnectionState(orgId, disconnectedState);
          setHubspotData(EMPTY_HUBSPOT_DATA);
        }
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Failed to load CRM connection status.");
        setHubspotData(EMPTY_HUBSPOT_DATA);
      } finally {
        setIsLoadingStatus(false);
      }
    };

    void loadConnection();
  }, [orgId, loadHubspotRecords]);

  const connectedProvider = useMemo(
    () => PROVIDERS.find((provider) => provider.id === connection.provider) || null,
    [connection.provider]
  );

  const isConnected = Boolean(connection.provider);

  const handleConnect = async (providerId: CRMProviderId) => {
    try {
      setErrorMessage("");

      if (providerId !== "hubspot") {
        setErrorMessage("Live OAuth is currently enabled only for HubSpot. Salesforce and Zoho are coming next.");
        return;
      }

      if (isConnected && connection.provider !== providerId) {
        const shouldSwitch = window.confirm(
          `You are currently connected to ${connectedProvider?.name}. Switch to ${
            PROVIDERS.find((provider) => provider.id === providerId)?.name
          }?`
        );
        if (!shouldSwitch) return;
      }

      setActiveProviderId(providerId);

      const authUrl = await getHubspotAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to start HubSpot connection.");
    } finally {
      setActiveProviderId(null);
    }
  };

  const handleDisconnect = async () => {
    try {
      setErrorMessage("");
      setActiveProviderId(connection.provider);

      if (connection.provider === "hubspot") {
        await disconnectHubspot();
      }

      const nextState: CRMConnectionState = {
        provider: null,
        connectedAt: null,
        lastSyncedAt: null,
        portalId: null,
      };

      setConnection(nextState);
      persistConnectionState(orgId, nextState);
      setHubspotData(EMPTY_HUBSPOT_DATA);
      setRecordsError("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to disconnect CRM provider.");
    } finally {
      setActiveProviderId(null);
    }
  };

  const handleSyncNow = async () => {
    if (!connection.provider) {
      setErrorMessage("Connect a CRM provider first.");
      return;
    }

    try {
      setErrorMessage("");
      setActiveProviderId(connection.provider);

      if (connection.provider !== "hubspot") {
        setErrorMessage("Live sync is currently enabled only for HubSpot.");
        return;
      }

      const syncState = await syncHubspotNow();
      const nextState: CRMConnectionState = {
        provider: "hubspot",
        connectedAt: syncState.connectedAt || connection.connectedAt || null,
        lastSyncedAt: syncState.lastSyncedAt || new Date().toISOString(),
        portalId: syncState.portalId || connection.portalId || null,
      };

      setConnection(nextState);
      persistConnectionState(orgId, nextState);
      await loadHubspotRecords();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to sync CRM provider.");
    } finally {
      setActiveProviderId(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">CRM Integrations</h1>
        <p className="text-sm text-gray-600 mt-1">
          Connect your CRM to sync accounts, contacts, deals, and activities.
        </p>
      </div>

      <Card className="mb-6 p-4 border border-blue-200 bg-blue-50">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-700 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900">Connection Status</p>
              {isConnected ? (
                <>
                  <p className="text-sm text-blue-800 mt-1">Connected to {connectedProvider?.name}</p>
                  {connection.portalId && (
                    <p className="text-xs text-blue-700 mt-1">Portal ID: {connection.portalId}</p>
                  )}
                  <p className="text-xs text-blue-700 mt-1">
                    Connected: {connection.connectedAt ? new Date(connection.connectedAt).toLocaleString() : "-"}
                  </p>
                  <p className="text-xs text-blue-700">
                    Last synced: {connection.lastSyncedAt ? new Date(connection.lastSyncedAt).toLocaleString() : "Never"}
                  </p>
                </>
              ) : (
                <p className="text-sm text-blue-800 mt-1">No CRM connected yet.</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="bg-white border-blue-300 text-blue-700 hover:bg-blue-100"
              onClick={handleSyncNow}
              disabled={!isConnected || activeProviderId !== null}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${activeProviderId !== null ? "animate-spin" : ""}`} />
              Sync Now
            </Button>
            <Button
              variant="outline"
              className="bg-white border-red-300 text-red-700 hover:bg-red-50"
              onClick={handleDisconnect}
              disabled={!isConnected || activeProviderId !== null}
            >
              <Unplug className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
            <Badge className={isConnected ? "bg-green-600 text-white border-0" : "bg-gray-400 text-white border-0"}>
              {isConnected ? "Connected" : "Not Connected"}
            </Badge>
          </div>
        </div>
      </Card>

      {isLoadingStatus && (
        <Card className="mb-6 p-4 border border-gray-200 bg-gray-50 text-gray-700 text-sm">
          Checking HubSpot connection status...
        </Card>
      )}

      {errorMessage && (
        <Card className="mb-6 p-4 border border-red-200 bg-red-50 text-red-700 text-sm">
          {errorMessage}
        </Card>
      )}

      {isConnected && connection.provider === "hubspot" && (
        <Card className="mb-6 p-5 border border-emerald-200 bg-emerald-50/40">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-700" />
              <h3 className="text-sm font-semibold text-emerald-900">Synced HubSpot Data</h3>
            </div>

            <Button
              variant="outline"
              className="bg-white border-emerald-300 text-emerald-700 hover:bg-emerald-100"
              onClick={() => {
                void loadHubspotRecords();
              }}
              disabled={isLoadingRecords || activeProviderId !== null}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingRecords ? "animate-spin" : ""}`} />
              {isLoadingRecords ? "Loading Data..." : "Refresh Data"}
            </Button>
          </div>

          <p className="text-xs text-emerald-800 mb-4">
            Latest records pulled from your connected HubSpot account.
          </p>

          {recordsError && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {recordsError}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="p-4 border border-gray-200 bg-white">
              <p className="text-xs font-semibold text-gray-700 mb-3">
                Contacts ({hubspotData.contacts.length})
              </p>
              <div className="space-y-3">
                {hubspotData.contacts.length === 0 ? (
                  <p className="text-xs text-gray-500">No contacts found.</p>
                ) : (
                  hubspotData.contacts.slice(0, 5).map((record, index) => (
                    <div
                      key={`${record.id || "contact"}-${index}`}
                      className="border-b border-gray-100 pb-2 last:border-0 last:pb-0"
                    >
                      <p className="text-xs font-medium text-gray-900">{getContactTitle(record)}</p>
                      <p className="text-xs text-gray-600">{toText(record.properties.email)}</p>
                      <p className="text-xs text-gray-600">{toText(record.properties.phone)}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="p-4 border border-gray-200 bg-white">
              <p className="text-xs font-semibold text-gray-700 mb-3">
                Companies ({hubspotData.companies.length})
              </p>
              <div className="space-y-3">
                {hubspotData.companies.length === 0 ? (
                  <p className="text-xs text-gray-500">No companies found.</p>
                ) : (
                  hubspotData.companies.slice(0, 5).map((record, index) => (
                    <div
                      key={`${record.id || "company"}-${index}`}
                      className="border-b border-gray-100 pb-2 last:border-0 last:pb-0"
                    >
                      <p className="text-xs font-medium text-gray-900">{getCompanyTitle(record)}</p>
                      <p className="text-xs text-gray-600">Domain: {toText(record.properties.domain)}</p>
                      <p className="text-xs text-gray-600">Industry: {toText(record.properties.industry)}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="p-4 border border-gray-200 bg-white">
              <p className="text-xs font-semibold text-gray-700 mb-3">Deals ({hubspotData.deals.length})</p>
              <div className="space-y-3">
                {hubspotData.deals.length === 0 ? (
                  <p className="text-xs text-gray-500">No deals found.</p>
                ) : (
                  hubspotData.deals.slice(0, 5).map((record, index) => (
                    <div
                      key={`${record.id || "deal"}-${index}`}
                      className="border-b border-gray-100 pb-2 last:border-0 last:pb-0"
                    >
                      <p className="text-xs font-medium text-gray-900">{getDealTitle(record)}</p>
                      <p className="text-xs text-gray-600">Amount: {toText(record.properties.amount)}</p>
                      <p className="text-xs text-gray-600">Stage: {toText(record.properties.dealstage)}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PROVIDERS.map((provider) => {
          const selected = connection.provider === provider.id;
          const loadingThisProvider = activeProviderId === provider.id;

          return (
            <Card key={provider.id} className={`p-5 border ${selected ? "border-blue-400" : "border-gray-200"}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-gray-700" />
                  <h3 className="text-sm font-semibold text-gray-900">{provider.name}</h3>
                </div>
                {selected && (
                  <Badge className="bg-blue-600 text-white border-0">Active</Badge>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-3">{provider.description}</p>

              <div className="rounded-md bg-gray-50 border border-gray-200 p-3 mb-4">
                <p className="text-xs font-semibold text-gray-700 mb-1">Data to Sync</p>
                <p className="text-xs text-gray-600">{provider.records}</p>
              </div>

              <Button
                onClick={() => handleConnect(provider.id)}
                disabled={activeProviderId !== null || (provider.id !== "hubspot" && isConnected && connection.provider === "hubspot")}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Link2 className="w-4 h-4 mr-2" />
                {loadingThisProvider
                  ? "Connecting..."
                  : provider.id !== "hubspot"
                  ? "Coming Soon"
                  : selected
                  ? "Reconnect"
                  : isConnected
                  ? "Switch and Connect"
                  : "Connect"}
              </Button>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 p-4 border border-amber-200 bg-amber-50">
        <div className="flex items-start gap-3">
          <Database className="w-5 h-5 text-amber-700 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-900">Integration Note</h3>
            <p className="text-sm text-amber-800 mt-1">
              HubSpot records shown above are loaded through your connected OAuth integration. Salesforce and Zoho data
              views will appear once those providers are wired with live APIs.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
