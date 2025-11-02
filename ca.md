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

### Generate Device Certificates

After you have the main certificates generated, you'll also need the device
certificates that go on the kiosk. <br>Currently, you will need to generate it
and place it on the kiosk manually. <br>The API comes with a command line tool,
`pnpm --filter cli start create-cert <kiosk id>`.<br> The generated file is at
`/certificates/devices/<kiosk id>_iotcertificatedata.json`, this file needs to
be placed on the kiosk at `C:\ProgramData\Redbox\UpdateClient\IoT`.

In the future, the kiosk should be able to grab it on its own.

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
modify `C:\Program Files\Redbox\REDS\Update Client\bin\appsettings.json`<br> !!!
Please make a backup first !!!<br><br> Change `IoTBrokerEndpoint`

// TODO: unsure if changing `IoTCertificateServiceUrl` is required here or not
