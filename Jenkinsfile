pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'  // Change to your AWS region
        AWS_CREDENTIALS = 'aws-credentials' // Jenkins credentials ID for AWS
        NODE_VERSION = '18.x'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Node.js') {
            steps {
                script {
                    // Install Node.js
                    nodejs(nodeJSInstallationName: 'Node ' + env.NODE_VERSION) {
                        sh 'node --version'
                        sh 'npm --version'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm run build'
                    // Create deployment artifact
                    sh 'tar -czf frontend-build.tar.gz .next package.json package-lock.json public'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'npm ci'
                    // Create deployment artifact
                    sh 'tar -czf backend-build.tar.gz src package.json package-lock.json'
                }
            }
        }

        stage('Deploy to AWS') {
            steps {
                withAWS(credentials: env.AWS_CREDENTIALS, region: env.AWS_REGION) {
                    script {
                        // Upload frontend build to S3
                        sh '''
                            aws s3 cp frontend/frontend-build.tar.gz s3://your-bucket-name/frontend/
                            aws s3 cp backend/backend-build.tar.gz s3://your-bucket-name/backend/
                        '''

                        // Trigger EC2 deployment via AWS Systems Manager
                        sh '''
                            aws ssm send-command \
                                --targets "Key=tag:Environment,Values=production" \
                                --document-name "AWS-RunShellScript" \
                                --parameters commands=["cd /app && \
                                    aws s3 cp s3://your-bucket-name/frontend/frontend-build.tar.gz . && \
                                    aws s3 cp s3://your-bucket-name/backend/backend-build.tar.gz . && \
                                    tar -xzf frontend-build.tar.gz -C frontend/ && \
                                    tar -xzf backend-build.tar.gz -C backend/ && \
                                    pm2 restart all"]
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment completed successfully!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
