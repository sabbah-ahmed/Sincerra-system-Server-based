# Bootstrap Terraform State Backend

## Purpose
This folder contains Terraform code to create the S3 bucket and DynamoDB table required for remote state storage.

## ⚠️ Important
Run this **ONCE** before using the main Infrastructure code.

## Steps

### 1. Initialize Terraform
```bash
cd Infrastructure/bootstrap
terraform init
```

### 2. Plan
```bash
terraform plan
```

### 3. Apply
```bash
terraform apply
```

This will create:
- **S3 Bucket**: `sincerra-terraform-state-dev`
  - Versioning enabled
  - Encryption enabled
  - Public access blocked
  
- **DynamoDB Table**: `sincerra-terraform-locks`
  - For state locking
  - Pay-per-request billing

### 4. After Creation
Once these resources are created, you can use the backend configuration in `env/development/backend.tf`

### 5. State Storage
The bootstrap state file will be stored **locally** in this folder. Keep it safe or commit to a private repo.

## Cleanup (Only if needed)
```bash
terraform destroy
```
**Warning**: This will delete the state bucket and lock table!
