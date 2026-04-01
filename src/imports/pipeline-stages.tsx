Create interactive pipeline stage cards for the Deals dashboard.

There are six pipeline stages:
Qualified
Discovery
Demo
Proposal
Negotiation
Closed Won

Each stage card should be clickable.

When a user clicks on any stage card, the system should display a dynamic table below the pipeline visualization showing the list of companies or deals currently in that stage.

The table should include:
Company Name
Deal Value
Owner (Sales Rep)
Close Date
Days in Stage
Deal Health Score

Interaction behavior:
Clicking "Qualified" shows only companies whose deal stage is Qualified.
Clicking "Discovery" shows only Discovery deals.
Clicking "Demo" shows Demo stage deals.
Clicking "Proposal" shows Proposal stage deals.
Clicking "Negotiation" shows Negotiation stage deals.
Clicking "Closed Won" shows Closed Won deals.

The table should update dynamically based on the selected stage.

Add hover state to the cards and highlight the selected stage when active.

Ensure the interaction works like a filter so the deals list updates instantly when another stage card is clicked.

Optional (if you want it to feel more SaaS-like)

Add this line to the prompt:

Also allow clicking the deal count number inside each stage card to trigger the same filtering behavior.

What the final UX should feel like

User clicks Demo (15 deals)
⬇
Table instantly updates

Company	Value	Rep	Close Date	Health
Acme Corp	$120k	Alex	Mar 18	🟢
Stripe	$80k	Maya	Mar 22	🟡
Hubspot	$65k	Rahul	Mar 28	🔴

Click Negotiation
⬇
Table refreshes.