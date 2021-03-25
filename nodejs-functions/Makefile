help: Makefile
	@sed -n 's/^## //p' $<

## npm-install-functions	-> Added dependencies in case that the functions need, add manually the command and Makefile 
install-dependencies-nodejs:
	cd src/handlers/automatic-clock-outs ; pwd ; $(MAKE) install

deploy:
	sls deploy