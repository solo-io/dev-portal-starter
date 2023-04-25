

#----------------------------------------------------------------------------------
# Variables
#----------------------------------------------------------------------------------

VERSION := 0.0.1
UI_ROOT_DIR := projects/ui

UI_ARGS=VITE_UI_VERSION=$(VERSION)
ifneq ($(VITE_RESTPOINT),)
	UI_ARGS += VITE_RESTPOINT=$(VITE_RESTPOINT)
else ifneq ($(RESTPOINT),)
	UI_ARGS += VITE_RESTPOINT=$(RESTPOINT)
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

# Note: if using the engineering-demos frontend-portal deployment, 
# the built image must be pushed to dockerhub for the deployed image to be 
# updated, if imagePullPolicy=Always
.PHONY: build-ui-image
build-ui-image: build-ui
	docker build -t $(IMAGE_NAME) . --platform=linux/amd64

.PHONY: lint-ui-code
lint-ui-code: update-ui-deps
	yarn tsc --cwd=$(UI_ROOT_DIR) && yarn --cwd=$(UI_ROOT_DIR) lint --max-warnings=0