mkdir -p configs
cd configs
openssl genrsa -des3 -passout pass:x -out server.pass.key 2048
echo "server.pass.key created"
openssl rsa -passin pass:x -in server.pass.key -out server.key
echo "server.key created"
rm server.pass.key
echo "server.pass.key removed"
openssl req -new -key server.key -out server.csr
echo "server.csr created"
openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt
echo "server.crt certificate created"