SECRETS=keys.yml
help: Makefile
	@sed -n 's/^## //p' $<

## npm-install-functions	-> Added dependencies in case that the functions need, add manually the command and Makefile 
install-dependencies-nodejs:
	cd src/handlers/automatic-clock-outs ; pwd ; $(MAKE) install

deploy:
	sls deploy

sops-encrypt:
	sops -e -i ${SECRETS}

sops-decrypt:
	sops -d -i ${SECRETS}