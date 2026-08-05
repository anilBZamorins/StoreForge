# Domain modules

Each folder is a self-contained business domain. Suggested internal layout per module:

```
Tenancy/
├── Models/          # Eloquent models
├── Services/        # e.g. ProvisionTenantService, SubdomainGenerator
├── Actions/         # Single-purpose invokable actions
├── Events/          # e.g. TenantProvisioned, SubscriptionStarted
└── Jobs/            # Queued work (provisioning steps, emails)
```

Requirement mapping (see Documents/StoreForge-BRD.docx):
- **Tenancy** → PRV-01..06, NFR-01
- **Billing** → SUB-01..07, BR-02/03/08
- **Catalog** → ADM-02, ADM-03, ADM-04
- **Orders**  → ADM-05, ADM-06, STF-06..09, Section 7 lifecycle
- **Customers** → ADM-07, STF-05
- **Reports** → ADM-08, SAD-03
