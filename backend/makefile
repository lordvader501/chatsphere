# Go parameters
GOCMD = go
GOBUILD = $(GOCMD) build
GOCLEAN = $(GOCMD) clean
GOTEST = $(GOCMD) test
GOGET = $(GOCMD) get
GODEV = air

# Build target
BINARY_NAME = ChatSphere

build:
	$(GOBUILD) -o ./tmp/$(BINARY_NAME) -v

test:
	$(GOTEST) -v 

clean:
	$(GOCLEAN)
	rm -f ./tmp/$(BINARY_NAME)

run:
	$(GOBUILD) -o ./tmp/$(BINARY_NAME) -v
	./tmp/$(BINARY_NAME)

dev:
	$(GODEV)

.PHONY: build test clean run dev 