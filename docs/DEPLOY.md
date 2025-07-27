1. Create a new project or select an existing one in Google Cloud Console

2. Get your project number:
```bash
gcloud projects describe $PROJECT_ID --format="value(projectNumber)"
```

3. Enable required APIs:
```bash
gcloud services enable \
  cloudrun.googleapis.com \
  containerregistry.googleapis.com \
  cloudbuild.googleapis.com \
  iam.googleapis.com
```

4. Set up Workload Identity Federation:
```bash
gcloud iam workload-identity-pools create "github" \
  --location="global" \
  --display-name="GitHub Actions Pool"

gcloud iam workload-identity-pools providers create-oidc "github-provider" \
  --location="global" \
  --workload-identity-pool="github" \
  --display-name="GitHub provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"

gcloud iam service-accounts create "github-actions" \
  --display-name="GitHub Actions Service Account"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

gcloud iam service-accounts add-iam-policy-binding "github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github/attribute.repository/[GITHUB_USER]/[REPO_NAME]"
```


Add the following secrets to your GitHub repository (Settings > Secrets and variables > Actions):

1. `GCP_PROJECT_ID`: Your Google Cloud project ID
2. `GCP_PROJECT_NUMBER`: Your Google Cloud project number (from step 2)
3. `GCP_SERVICE_ACCOUNT`: The service account email (github-actions@$PROJECT_ID.iam.gserviceaccount.com)
4. `FIREBASE_PROJECT_ID`: Your Firebase project ID
5. `FIREBASE_PRIVATE_KEY`: Your Firebase private key
6. `FIREBASE_CLIENT_EMAIL`: Your Firebase client email
6. `FIREBASE_DATABASE_URL`: Your Firebase database URL
7. `OPENWEATHER_API_KEY`: Your OpenWeather API key


The GitHub Actions workflow will automatically deploy your backend to Cloud Run when:
- You push to the `main` branch
- Changes are made in the `apps/api` or `packages` directories

The workflow:
1. Authenticates with Google Cloud using Workload Identity Federation
2. Builds the Docker image
3. Pushes the image to Google Container Registry
4. Deploys the image to Cloud Run
5. Sets up all environment variables


1. You can monitor deployments in the GitHub Actions tab of your repository
2. The workflow will output the Cloud Run service URL after successful deployment
3. You can also check the deployment status in the Google Cloud Console:
   - Go to Cloud Run
   - Select your service (weather-api)
   - View deployment history and logs
