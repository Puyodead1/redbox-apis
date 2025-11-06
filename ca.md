# Certificate Authority

The original Redbox infrastructure used AWS IoT which managed certificates used
for mutal TLS.

Our goal is to keep everything as original as possible, and reduce patching. To
do this, we implement a basic self signed certificate authority.

On the first run, required certificates are generated. Any time you start the
api, missing certificates will be generated.

Before the certificates will be generated correctly for your use, you will need
to edit the configuration to set the correct common name, alternative names, and
crl distribution endpoint. In my case, I just use the hostname of another pc on
the local network hosting the API, such as `MyServer.local`.

Note that configuration changes for the certificate information will NOT apply
to certificates already generated! You will need to delete them and let the
server regenerate them.

The kiosk will automatically obtain a new certificate and connect to MQTT.

### Install Root CA

Finally, windows needs to trust our self signed CA, and we will do this by
importing the Root CA:

- Copy `/certificates/root.crt` to your kiosk
- Double Click it
- Click `Install Certificate`
- Under `Store Location` select `Local Machine`
- Click Next
- Select `Place all certificates in the following store`
- Click Browse
- Select `Trusted Root Certification Authorities`
- Click `OK`
- Click Next
- Click Finish

### Configuration Changes

To get the kiosk to actually use your custom MQTT Broker, you will need to
modify
`C:\Program Files\Redbox\REDS\Update Client\bin\appsettings.Production.json`<br>
!!! Please make a backup first !!!<br><br> Change `IoTBrokerEndpoint`

// TODO: unsure if changing `IoTCertificateServiceUrl` is required here or not
