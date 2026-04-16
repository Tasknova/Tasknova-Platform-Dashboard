import { useState, useEffect } from 'react';
import { Phone, Loader, Check, X, AlertCircle, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import { supabase } from '../../lib/supabase';
import { getAssignedNumbersForUser, ManagedCallNumber } from '../../lib/callNumbers';
import {
  induslabsClick2Call,
  induslabsPollTranscript,
  InduslabsCallConfig,
} from '../../lib/induslabs';

interface Lead {
  lead_id: string;
  full_name: string;
  company?: string;
  phone_e164: string;
  job_title?: string;
}

interface MakeCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCallCompleted?: (callData: any) => void;
}

type CallStatus = 'idle' | 'loading' | 'calling' | 'polling' | 'completed' | 'error';

interface CallState {
  status: CallStatus;
  callId?: string;
  message: string;
  error?: string;
}

export function MakeCallDialog({ open, onOpenChange, onCallCompleted }: MakeCallDialogProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [fromNumber, setFromNumber] = useState<string>('');
  const [assignedNumbers, setAssignedNumbers] = useState<ManagedCallNumber[]>([]);
  const [callMode, setCallMode] = useState<'lead' | 'manual'>('lead');
  const [manualPhoneNumber, setManualPhoneNumber] = useState<string>('');
  const [manualContactName, setManualContactName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [callState, setCallState] = useState<CallState>({
    status: 'idle',
    message: '',
  });
  const [transcript, setTranscript] = useState<any>(null);

  // Load leads on component mount
  useEffect(() => {
    if (open) {
      loadLeads();
      loadAssignedNumbers();
    }
  }, [open]);

  const loadAssignedNumbers = () => {
    const organizationId = localStorage.getItem('userOrganization') || '';
    const userId = localStorage.getItem('userId') || '';

    const available = getAssignedNumbersForUser(organizationId, userId);
    setAssignedNumbers(available);

    if (available.length > 0) {
      setFromNumber((current) =>
        current && available.some((item) => item.phoneNumber === current)
          ? current
          : available[0].phoneNumber
      );
    } else {
      setFromNumber('');
    }
  };

  const loadLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('lead_id, full_name, company, phone_e164, job_title')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setLeads(data || []);
      if (data && data.length > 0) {
        setSelectedLeadId(data[0].lead_id);
      }
    } catch (error) {
      console.error('Failed to load leads:', error);
      setCallState({
        status: 'error',
        message: 'Failed to load leads',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const handleMakeCall = async () => {
    let toNumber: string;
    let contactName: string;
    let lead: Lead | null = null;

    if (callMode === 'lead') {
      if (!selectedLeadId || !fromNumber) {
        setCallState({
          status: 'error',
          message: 'Please select a lead and choose one of your assigned numbers',
        });
        return;
      }

      const selectedLead = leads.find((l) => l.lead_id === selectedLeadId);
      if (!selectedLead) {
        setCallState({
          status: 'error',
          message: 'Selected lead not found',
        });
        return;
      }

      toNumber = selectedLead.phone_e164;
      contactName = selectedLead.full_name;
      lead = selectedLead;
    } else {
      if (!manualPhoneNumber || !fromNumber || !manualContactName) {
        setCallState({
          status: 'error',
          message: 'Please enter contact details and choose one of your assigned numbers',
        });
        return;
      }

      toNumber = manualPhoneNumber;
      contactName = manualContactName;
    }

    try {
      setCallState({
        status: 'calling',
        message: 'Initiating call...',
      });

      // Prepare agent config
      const agentConfig: InduslabsCallConfig = {
        client_name: contactName,
        additional_details: lead
          ? `Company: ${lead.company || 'N/A'}, Title: ${lead.job_title || 'N/A'}`
          : 'Manual dial',
      };

      // Make the click2call request
      const callResult = await induslabsClick2Call(
        toNumber,
        fromNumber,
        true, // enable transcript
        'en', // language
        agentConfig
      );

      setCallState({
        status: 'polling',
        callId: callResult.call_id,
        message: 'Call queued. Waiting for transcript...',
      });

      // Poll for transcript
      const transcriptData = await induslabsPollTranscript(callResult.call_id, 60, 3000);

      setTranscript(transcriptData);

      // Save call record to database (only if we have a lead)
      if (lead) {
        await saveCallRecord(lead, callResult.call_id, transcriptData);
      }

      setCallState({
        status: 'completed',
        callId: callResult.call_id,
        message: 'Call completed successfully!',
      });

      if (onCallCompleted) {
        onCallCompleted({
          callId: callResult.call_id,
          lead: lead,
          transcript: transcriptData,
          contactName: contactName,
          toNumber: toNumber,
        });
      }
    } catch (error) {
      console.error('Call failed:', error);
      setCallState({
        status: 'error',
        message: 'Call failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const saveCallRecord = async (
    lead: Lead,
    induslabsCallId: string,
    transcriptData: any
  ) => {
    try {
      // Get the org_id from current organization context
      const organizationId = 'e09c5e73-64e4-4893-9056-eb4df3442b39'; // This should come from auth context

      // First, create a canonical event
      const { data: eventData, error: eventError } = await supabase
        .from('canonical_events')
        .insert({
          org_id: organizationId,
          lead_id: lead.lead_id,
          event_type: 'call.completed',
          source_channel: 'call',
          idempotency_key: `call_${induslabsCallId}_${Date.now()}`,
          raw_event_id: '550e8400-e29b-41d4-a716-446655440001', // Placeholder, you may need to create raw events too
          trace_id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
          source_system: 'exotel',
          payload: { induslabs_call_id: induslabsCallId },
        })
        .select()
        .single();

      if (eventError) throw eventError;

      // Then, create the call record
      const { error: callError } = await supabase
        .from('call_records')
        .insert({
          org_id: organizationId,
          event_id: eventData.event_id,
          source_system: 'other',
          recording_storage_path: transcriptData.recording || null,
          transcript_text: transcriptData.transcript?.history || null,
          summary: transcriptData.transcript?.summary || null,
          participants: [{ name: lead.full_name, role: 'prospect' }],
          duration_seconds: transcriptData.duration || 0,
          lead_id: lead.lead_id,
          from_number: fromNumber,
          to_number: lead.phone_e164,
          call_status: 'completed',
          induslabs_call_id: induslabsCallId,
          sentiment: null,
          topics: null,
          quality_score: null,
        });

      if (callError) throw callError;
    } catch (error) {
      console.error('Failed to save call record:', error);
      // Don't throw - we still want to show the call was successful even if saving failed
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setCallState({ status: 'idle', message: '' });
    setTranscript(null);
    setSelectedLeadId(leads.length > 0 ? leads[0].lead_id : '');
    setFromNumber('');
    setAssignedNumbers([]);
    setCallMode('lead');
    setManualPhoneNumber('');
    setManualContactName('');
    setSearchQuery('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Make a Call</DialogTitle>
          <DialogDescription>
            Select a lead and initiate a Click2Call through Induslabs
          </DialogDescription>
        </DialogHeader>

        {callState.status === 'idle' || callState.status === 'error' ? (
          <div className="space-y-4">
            {callState.status === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {callState.message}
                  {callState.error && `: ${callState.error}`}
                </AlertDescription>
              </Alert>
            )}

            {/* Mode Toggle */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <Button
                size="sm"
                variant={callMode === 'lead' ? 'default' : 'ghost'}
                onClick={() => {
                  setCallMode('lead');
                  setSearchQuery('');
                }}
                className="w-1/2 text-sm font-semibold"
              >
                Select from Leads
              </Button>
              <Button
                size="sm"
                variant={callMode === 'manual' ? 'default' : 'ghost'}
                onClick={() => setCallMode('manual')}
                className="w-1/2 text-sm font-semibold"
              >
                Manual Entry
              </Button>
            </div>

            {callMode === 'lead' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="search-lead">Search Lead*</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="search-lead"
                      placeholder="Search by name, company, or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      autoComplete="off"
                    />
                  </div>
                </div>

                {searchQuery && (
                  <div className="border rounded-lg max-h-48 overflow-y-auto bg-white">
                    {leads
                      .filter(
                        (lead) =>
                          lead.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.phone_e164.includes(searchQuery)
                      )
                      .map((lead) => (
                        <button
                          key={lead.lead_id}
                          onClick={() => setSelectedLeadId(lead.lead_id)}
                          className={`w-full text-left px-4 py-3 border-b hover:bg-blue-50 transition ${
                            selectedLeadId === lead.lead_id
                              ? 'bg-blue-100 border-l-4 border-l-blue-600'
                              : ''
                          }`}
                        >
                          <div className="font-semibold text-gray-900">{lead.full_name}</div>
                          <div className="text-sm text-gray-600">{lead.company}</div>
                          <div className="text-xs text-gray-500">{lead.phone_e164}</div>
                          {lead.job_title && <div className="text-xs text-gray-500">{lead.job_title}</div>}
                        </button>
                      ))}
                    {leads.filter(
                      (lead) =>
                        lead.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        lead.phone_e164.includes(searchQuery)
                    ).length === 0 && (
                      <div className="px-4 py-6 text-center text-gray-500 text-sm">
                        No leads found matching "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}

                {!searchQuery && selectedLeadId && (
                  <div className="text-center text-gray-500 text-sm py-4">
                    Start typing to search for a lead
                  </div>
                )}

                {leads.find((l) => l.lead_id === selectedLeadId) && (
                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                    <div className="text-sm font-semibold text-blue-900 mb-2">Selected Lead</div>
                    <div className="font-medium text-gray-900">
                      {leads.find((l) => l.lead_id === selectedLeadId)?.full_name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {leads.find((l) => l.lead_id === selectedLeadId)?.company}
                    </div>
                    {leads.find((l) => l.lead_id === selectedLeadId)?.job_title && (
                      <div className="text-sm text-gray-600">
                        {leads.find((l) => l.lead_id === selectedLeadId)?.job_title}
                      </div>
                    )}
                    <div className="mt-2 text-gray-700 font-mono text-sm">
                      {leads.find((l) => l.lead_id === selectedLeadId)?.phone_e164}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Contact Name*</Label>
                  <Input
                    id="contact-name"
                    placeholder="John Doe"
                    value={manualContactName}
                    onChange={(e) => setManualContactName(e.target.value)}
                    disabled={callState.status === 'calling' || callState.status === 'polling'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manual-phone">Phone Number*</Label>
                  <Input
                    id="manual-phone"
                    type="tel"
                    placeholder="+1-555-0123"
                    value={manualPhoneNumber}
                    onChange={(e) => setManualPhoneNumber(e.target.value)}
                    disabled={callState.status === 'calling' || callState.status === 'polling'}
                  />
                  <p className="text-xs text-gray-500">E.164 format recommended (e.g., +14155551234)</p>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="from-number">From Number*</Label>
              <Select
                value={fromNumber || undefined}
                onValueChange={(value) => setFromNumber(value)}
                disabled={
                  callState.status === 'calling' ||
                  callState.status === 'polling' ||
                  assignedNumbers.length === 0
                }
              >
                <SelectTrigger id="from-number" className="h-10">
                  <SelectValue placeholder="Select your assigned number" />
                </SelectTrigger>
                <SelectContent>
                  {assignedNumbers.map((item) => (
                    <SelectItem key={item.id} value={item.phoneNumber}>
                      {item.phoneNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {assignedNumbers.length === 0 ? (
                <p className="text-xs text-amber-700">
                  No verified numbers are assigned to your account. Ask admin to add, verify, and assign one.
                </p>
              ) : (
                <p className="text-xs text-gray-500">Only numbers assigned to you are available for calling.</p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleMakeCall}
                disabled={
                  !fromNumber ||
                  (callMode === 'lead' ? !selectedLeadId : !manualPhoneNumber || !manualContactName)
                }
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Phone className="w-4 h-4" />
                Make Call
              </Button>
            </div>
          </div>
        ) : callState.status === 'calling' || callState.status === 'polling' ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse" />
              <Loader className="w-12 h-12 text-blue-600 animate-spin relative" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">{callState.message}</p>
              {callState.callId && (
                <p className="text-sm text-gray-500 mt-2">Call ID: {callState.callId}</p>
              )}
            </div>
          </div>
        ) : callState.status === 'completed' ? (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Call completed successfully!
              </AlertDescription>
            </Alert>

            {transcript && (
              <div className="space-y-3">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Call Details</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Duration:</span> {transcript.duration || 0} seconds
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {transcript.transcript_status}
                    </div>
                    {transcript.recording && (
                      <div>
                        <span className="font-medium">Recording:</span> Available
                      </div>
                    )}
                  </div>
                </div>

                {transcript.transcript?.summary && (
                  <div className="rounded-lg bg-blue-50 p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
                    <p className="text-sm text-gray-700">{transcript.transcript.summary}</p>
                  </div>
                )}

                {transcript.transcript?.history && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Transcript</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {transcript.transcript.history}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button onClick={handleClose} className="bg-blue-600 hover:bg-blue-700">
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
