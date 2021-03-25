help: Makefile
	@sed -n 's/^## //p' $<

## npm-install-functions	-> Added dependencies in case that the functions need, add manually the command and Makefile 
deploy-nodejs-functions:
	cd nodejs-functions ; pwd ; $(MAKE) functions-with-dependencies

