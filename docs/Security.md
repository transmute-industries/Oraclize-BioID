

### Authentication

This is a work in progress and subject to change. 
The objective is to describe custom authentication flows.

#### Option 1

User creates new HD wallet.

User requests enrollment message to sign from server and provides their address.

Server responds with enrollment message and action url.

User takes action to enroll, including a signed enrollment message and address.

BioID returns the result of the enrollment request to the server.

Server verifies the enrollment message, address and BCID, and ceates a JWT for the given address.

Identifiers: 
BCID - Biometric Class ID
Address - from HD wallet

Secrets:
Mneumonic - for HD Wallet (associated private keys)


