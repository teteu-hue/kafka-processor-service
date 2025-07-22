#!/bin/bash
# Wait for MongoDB to be ready (optional, just to be safe)
sleep 10

# Connect to MongoDB and create the database "processor_service" and a sample collection
mongosh --host mongodb:27017 <<EOF
use processor_service
db.createCollection('processor_service')  # Creating a sample collection
db.processor_service.insert({ "exampleField": "initialData" })  # Insert sample data to trigger DB creation
EOF