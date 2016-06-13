.PHONY: pass fail mix test

TAP = ./node_modules/tape/bin/tape
MIN = ./bin/tap-difflet

pass:
	@$(TAP) test/pass.js | $(MIN)

fail:
	@$(TAP) test/fail.js | $(MIN)

mix:
	@$(TAP) test/mix.js | $(MIN)

mixp:
	@$(TAP) test/mix.js | $(MIN) -p 

test: pass fail
