# Superhero Database

## Description
Superhero Database is an interactive web application designed to allow comic book enthusiasts and researchers to search for, manage, and curate collections of superhero data. This project provides detailed information on superheroes, including their names, races, publishers, and powers, along with the ability to create, update, and delete custom lists of superheroes.

## Features
- **Search Functionality**: Users can search for superheroes by name, race, publisher, and power.
- **List Management**: Users can create personalized superhero lists and manage them through the interface.
- **Data Visualization**: Display superheroes' information in an easily digestible format.
- **Responsive Design**: A user-friendly interface that adjusts to different screen sizes for accessibility on various devices.

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Deployment**: AWS EC2

## Deployment on AWS EC2

This project was deployed on Amazon Web Services (AWS) using an Elastic Compute Cloud (EC2) instance. AWS EC2 provides scalable computing capacity in the AWS cloud, allowing for the deployment and management of server instances in a virtual environment. The deployment process encompassed the setup of an EC2 instance, installation of PostgreSQL, and configuration of a production environment database.

### EC2 Instance Setup

The first step was to create an EC2 instance, which acts as a virtual server in the cloud. The instance was set up as follows:

- **Instance Selection**: A suitable instance type was chosen based on the computing, memory, and storage needs of the project.
- **Security Group Configuration**: Security groups were configured to define the traffic allowed to and from the instance, ensuring controlled access to the server.
- **SSH Keys**: For secure access, an SSH key pair was generated. The private key (`.ppk` file) was downloaded and stored securely, which is essential for SSH access to the instance. Once the instance was launched and running, I connected to it via SSH.

## PostgreSQL Installation

PostgreSQL was installed on the EC2 instance to serve as the production database. The following steps were taken:

- **Package Update**: Ensured all packages were up-to-date using the package manager.
- **Installation**: PostgreSQL was installed via the package manager specific to the operating system running on the EC2 instance.
- **Database Initialization**: The PostgreSQL database cluster was initialized to configure the necessary directories and default settings.
- **Configuration**: PostgreSQL configuration files were edited to fine-tune the database server settings, such as adjusting the connection settings and setting the appropriate port.

## Database Setup

I created a production environment database within PostgreSQL, executing the necessary SQL commands to create tables and populate them with initial data. The process involved:

- **Database Creation**: A new database was created to house the project data.
- **Tables and Schemas**: Using the psql command-line tool, I executed SQL commands to set up the tables and schemas as required by the project.

## Backend Service

The backend service was deployed on the EC2 instance to interact with the PostgreSQL database. Necessary environment variables were set up to manage database credentials and connection strings securely.

## Attaching the Database

The EC2 instance was configured to allow connections to the PostgreSQL database. Network ACLs, security groups, and PostgreSQL's `pg_hba.conf` were all configured to ensure that the backend could communicate with the database securely and efficiently.

## Serving the Backend

The backend server was started on the EC2 instance, and a reverse proxy was configured to serve it to the internet. This included:

- **Web Server Configuration**: A web server was set up to reverse proxy requests to the backend application.
- **Domain Name**: If applicable, a domain name was configured to point to the EC2 instance for user-friendly access.

The combination of AWS EC2's flexible service and PostgreSQL's powerful database management enabled a robust production environment for this project. This deployment strategy showcases my ability to leverage cloud resources effectively and securely.
