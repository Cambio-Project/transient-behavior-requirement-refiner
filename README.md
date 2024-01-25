# TQPropRefiner

This tool verifies a specification in form of a Property Specificiation Pattern (PSP) against runtime data and assists in refining parameters interactively.

<!-- GETTING STARTED -->
## Getting Started
The project can be set up locally either with Docker or the Angular CLI. To get a local copy up and running follow these simple steps.

### Docker

To run the project using Docker follow these steps.

1. Clone the repository and navigate to its root folder
   ```sh
	git clone https://github.com/Cambio-Project/transient-behavior-requirement-refiner.git
	cd transient-behavior-requirement-refiner	 
   ```
2. Build the containers
   ```sh
	docker compose up  
   ```
3. Navigate to `http://localhost:8080/`.

### Angular CLI

For development purposes run a local dev server using the Angular CLI.

1. Install Angular CLI
   ```sh
   npm install -g @angular/cli
   ```
2. Clone the repository and navigate to its root folder
   ```sh
	git clone https://github.com/Cambio-Project/transient-behavior-requirement-refiner.git
	cd transient-behavior-requirement-refiner	 
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Run a local development server
   ```sh
   ng serve
   ```
5. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Import Data -->
## Import Data
The tool offers three data sources: Demo, File Upload, and Prometheus.

### Demo

To quickly explore the tool, three sets of demo runtime data are included. To check them out, set the file source to "Demo" and select one of the demo files.

### File Upload

To analyze your own runtime data, set the file soure to "Upload". Currently, only .csv files are supported in which each column contains a metric and each row represents a time unit. You can find examples for compatible files in the `src/assets/csv` folder.

### Prometheus

Select "Prometheus" as the file source to fetch data from a Prometheus database. Follow these steps to set up a connection and query the database.

#### Connect to Database
If you have your own Prometheus instance running, skip the first step.
1. Download Prometheus `https://prometheus.io/download/` and check this guide `https://prometheus.io/docs/prometheus/latest/getting_started/`.
3. Enter the Database URL under "Prometheus Connection URL".
4. If the database is password protected, check "Provide Credentials" and enter the username and password.
5. Press "Connect".

#### Query Database
1. Choose a start time, end time, and a step size.
2. Choose metrics from the selection list OR activate "Custom Query" and enter your own PromQL query.
3. Press "Query".

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Showcases
### TQPropRefiner with Manual Timebound Refinement
[![](https://markdown-videos.vercel.app/youtube/fy_vLCxptAs)](https://youtu.be/fy_vLCxptAs)

### TQPropRefiner with Automatic Timebound Refinement
[![](https://markdown-videos.vercel.app/youtube/OjZPbsXNw1g)](https://youtu.be/OjZPbsXNw1g)

<p align="right">(<a href="#readme-top">back to top</a>)</p>