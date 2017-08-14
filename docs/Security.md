

### Authentication

This is a work in progress and subject to change. 
The objective is to describe custom authentication flows.

#### Option 1 - System Managed Wallet

User requests an account by signing up with email + password.

System creates an account for the user.

System authenticates user via these credentials moving forward.

All user actions must flow through the system.

The system manages a wallet per User, and is responsible for funding it.

The system uses the User wallet to take actions on the blockchain on behalf of the user.

The user has no control over their wallet or blockchain identity, unless the system reveals the wallet to the user.

Identifiers: 
Username

Secrets:
Password

#### Option 2 - User Managed Wallet

User creates new HD wallet.

User requests enrollment message to sign from server and provides their address.

Server responds with enrollment message and action url.

User takes action to enroll, including a signed enrollment message and address.

BioID returns the result of the enrollment request to the server.

Server verifies the enrollment message, address and BCID, and ceates a JWT for the given address.

System has no control over user wallet, but can choose to not log activity related to it.

Identifiers: 
BCID - Biometric Class ID
Address - from HD wallet

Secrets:
Mneumonic - for HD Wallet (associated private keys)

### Audit Log

#### Option 1 - System Managed Audit Log

The system maintains an event store contract per address.

The system writes authentication related events to the blockchain (encrypted events in the future).

The system can read the event log for each address.

Under this model, the system pays the gas cost for all authentication related activities, but the identities are still managed by the user's wallet.

The benefit is that the system can revoke access to the audit log at any point.

#### Option 2 - User Managed Audit Log

After authenticating with the system.

The user can sign transactions for updating their audit log.

The user can then pay the gas cost to update their audit log.

The disadvantage of this is that a compromised user can pollute the audit log.