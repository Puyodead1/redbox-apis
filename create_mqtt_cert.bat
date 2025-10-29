@echo off
openssl genrsa -out mqtt.key 2048
openssl req -new -key mqtt.key -out mqtt.csr -config mqtt.cnf
openssl x509 -req -in mqtt.csr -CA RootCA.crt -CAkey RootCA.key -CAcreateserial -out mqtt.crt -days 3650 -sha256 -extfile mqtt.cnf -extensions req_ext
del mqtt.csr
del RootCA.srl