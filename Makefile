help: Makefile
	@sed -n 's/^## //p' $<

## npm-install-functions	-> Added dependencies in case that the functions need, add manually the command and Makefile 
install-dependencies-nodejs:
	cd nodejs-functions ; pwd ; $(MAKE) install-dependencies-nodejs

deploy-nodejs:
	cd nodejs-functions ; pwd ; $(MAKE) deploy