gcloud builds submit --tag gcr.io/comp2003/image-upload
gcloud run deploy image-upload \
  --image gcr.io/comp2003/image-upload \
  --platform managed \
  --region europe-north1 \
  --allow-unauthenticated