#----------------------------------------------------------------------------------
# Variables
#----------------------------------------------------------------------------------

VERSION := 0.0.1
UI_ROOT_DIR := projects/ui

UI_ARGS=VITE_UI_VERSION=$(VERSION)
#
# PORTAL_SERVER_URL
ifneq ($(VITE_PORTAL_SERVER_URL),)
	UI_ARGS += VITE_PORTAL_SERVER_URL=$(VITE_PORTAL_SERVER_URL)
else ifneq ($(PORTAL_SERVER_URL),)
	UI_ARGS += VITE_PORTAL_SERVER_URL=$(PORTAL_SERVER_URL)
endif
#
# CLIENT_ID
ifneq ($(VITE_CLIENT_ID),)
	UI_ARGS += VITE_CLIENT_ID=$(VITE_CLIENT_ID)
else ifneq ($(CLIENT_ID),)
	UI_ARGS += VITE_CLIENT_ID=$(CLIENT_ID)
endif
#
# TOKEN_ENDPOINT
ifneq ($(VITE_TOKEN_ENDPOINT),)
	UI_ARGS += VITE_TOKEN_ENDPOINT=$(VITE_TOKEN_ENDPOINT)
else ifneq ($(TOKEN_ENDPOINT),)
	UI_ARGS += VITE_TOKEN_ENDPOINT=$(TOKEN_ENDPOINT)
endif
#
# AUTH_ENDPOINT
ifneq ($(VITE_AUTH_ENDPOINT),)
	UI_ARGS += VITE_AUTH_ENDPOINT=$(VITE_AUTH_ENDPOINT)
else ifneq ($(AUTH_ENDPOINT),)
	UI_ARGS += VITE_AUTH_ENDPOINT=$(AUTH_ENDPOINT)
endif
#
# LOGOUT_ENDPOINT
ifneq ($(VITE_LOGOUT_ENDPOINT),)
	UI_ARGS += VITE_LOGOUT_ENDPOINT=$(VITE_LOGOUT_ENDPOINT)
else ifneq ($(LOGOUT_ENDPOINT),)
	UI_ARGS += VITE_LOGOUT_ENDPOINT=$(LOGOUT_ENDPOINT)
endif
#
# APPLIED_OIDC_AUTH_CODE_CONFIG
ifneq ($(VITE_APPLIED_OIDC_AUTH_CODE_CONFIG),)
	UI_ARGS += VITE_APPLIED_OIDC_AUTH_CODE_CONFIG=$(VITE_APPLIED_OIDC_AUTH_CODE_CONFIG)
else ifneq ($(APPLIED_OIDC_AUTH_CODE_CONFIG),)
	UI_ARGS += VITE_APPLIED_OIDC_AUTH_CODE_CONFIG=$(APPLIED_OIDC_AUTH_CODE_CONFIG)
endif




#----------------------------------------------------------------------------------
# Targets
#----------------------------------------------------------------------------------

.PHONY: clean
clean:
	rm -rf $(UI_ROOT_DIR)/node_modules

.PHONY: install-tools
install-tools: update-ui-deps

.PHONY: update-ui-deps
update-ui-deps:
	yarn --cwd=$(UI_ROOT_DIR) install

.PHONY: run-ui
run-ui: update-ui-deps
	$(UI_ARGS) yarn --cwd=$(UI_ROOT_DIR) start

.PHONY: run-storybook
run-storybook:
	$(UI_ARGS) yarn --cwd=$(UI_ROOT_DIR) storybook

.PHONY: build-ui
build-ui: update-ui-deps
	$(UI_ARGS) yarn --cwd=$(UI_ROOT_DIR) build

.PHONY: preview-ui
preview-ui: update-ui-deps
	$(UI_ARGS) yarn --cwd=$(UI_ROOT_DIR) preview

# # Note: if using the engineering-demos frontend-portal deployment,
# # the built image must be pushed to dockerhub for the deployed image to be
# # updated, if imagePullPolicy=Always
# .PHONY: build-ui-image
# build-ui-image:
# 	docker build -t $(IMAGE_NAME) . --platform=linux/amd64


.PHONY: lint-ui-code
lint-ui-code: update-ui-deps
	yarn tsc --cwd=$(UI_ROOT_DIR) && yarn --cwd=$(UI_ROOT_DIR) lint --max-warnings=0
