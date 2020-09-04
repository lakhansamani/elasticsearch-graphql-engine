package main


import (
	"os"
	"log"
	"flag"
	"net/http"

	"github.com/graphql-go/graphql"
	"github.com/graphql-go/handler"
)

var (
	port string
	elasticsearchURL string
)

func main() {
	// flags
	flag.StringVar(&elasticsearchURL, "elasticsearch_url", "", "Elasticsearch URL")
	flag.StringVar(&port, "port", "", "Port on which graphql server should run")
	flag.Parse()

	// elasticsearch url
	if elasticsearchURL == "" {
		elasticsearchURL = os.Getenv("ELASTICSEARCH_URL")		
		if elasticsearchURL == "" {
			log.Fatal("ELATICSEARCH_URL enviornment variable is missing")
		}
	}
	

	// port config
	if port == "" {
		port = os.Getenv("PORT")
		if port == "" {
			port = "8080"	
		}
	}


	fields := graphql.Fields{
		"hello": &graphql.Field{
			Type: graphql.String,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return "world", nil
			},
		},
	}
	rootQuery := graphql.ObjectConfig{Name: "RootQuery", Fields: fields}
	schemaConfig := graphql.SchemaConfig{Query: graphql.NewObject(rootQuery)}
	schema, err := graphql.NewSchema(schemaConfig)
	if err != nil {
		log.Fatalf("failed to create new schema, error: %v", err)
	}

	h := handler.New(&handler.Config{
		Schema: &schema,
		Pretty: true,
		GraphiQL: true,
	})

	http.Handle("/graphql", h)

	log.Println("=> started elasticsearch graphql server on port:",port)
	log.Println("=> graphql endpoint: /graphql")

	// log envs
	log.Println("=> elasticsearch url", elasticsearchURL)

	http.ListenAndServe("0.0.0.0:"+ port, nil)
}
