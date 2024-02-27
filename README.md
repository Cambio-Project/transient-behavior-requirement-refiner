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

### Performance Considerations
The following table shows the time for validating and time refinement with no solution (worst case).
Validation scales well up to 50000 samples, time refinement up to 10000 samples. 

| samples	 | validation	                                           | time-refinement |
|----------|-------------------------------------------------------|-----------------|
| 10	      | <0.1s		                                               | ~0.1s           |
| 100	     | <0.1s		                                               | ~0.4s           |
| 1000	    | <0.1s                                                 | ~34s            |
| 10000	   | ~0.6s		                                               | ~3100s (51 min) |
| 50000    | ~3s		                                                 | --              |
| 100000	  | --------------- out of memory ----------------------- | --              |

To give perspective, for validation-only, reasonable intervals for different sampling rates are:
- 50 seconds interval with a 1 millisecond sampling rate. (50000 samples)
- 1 hour interval with a 75 millisecond sampling rate. (46800 samples)
- 1 day of with a 2 seconds sampling rate. (43200 samples)
- 1 week interval with a 10 seconds sampling rate. (60480 samples)

and for time-refinement, reasonable intervals for different sampling rates are:
- 1 second with a 1 millisecond sampling rate. (1000 samples)
- 1 minute with a 75 millisecond sampling rate. (800 samples)
- 1 hour with a 5 seconds sampling rate. (720 samples)
- 1 day with a 1 minute sampling rate. (1440 samples)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Refine Requirement -->
## Refine Requirement
After importing data from one of the sources as described under <a href="#import-data">Import Data</a>, go to the step "Select Pattern" and choose a Property Specification Pattern.

### 1. Select Pattern
1. Select Scope.
2. Select Category.
3. Select Pattern.

The selected pattern is the basis for the following specification.

### 2. Enter Specification
Each Pattern consists of one or more predicates that can be specified as follows:
1. Expand the specification form by clicking on the "Pen" icon.
2. Enter an arbitrary name.
3. Select a Measurement Source (this is the predicate's underlying metric from the imported runtime data).
4. Select a Logic Operator.
5. Set a Comparison Value (not applicable for trend operators).
6. Repeat these steps for all predicates of the selected PSP.

The graph next to each specification form visualizes the time dependant evaluation of the predicate. Green areas mark intervalls, in which the predicate evaluates to true. Red areas indicate its evaluation to false.

### 3. Analyze Specification
After specifying all predicates, the overall PSP is evaluated. A green box around the specifiaction indicates, that the given specification is satisfied. An unfulfilled requirement is indicated by a red box. The evaluation result is also displayed in the summary graph at the top of this screen.

### 4. Refine Specification
The specification and its predicates can be refined manually by the user or assissted by the tool.

#### Manual Refinement
To manually refine a specification, change a predicate's comparison value and/or operator. Potenial evaluation changes of the predicate and the overall pattern are visualized interactively.

#### Assisted Refinement
To automatically refine a specification, click the "Gear" icon next to the "Pen" icon of the predicate to be refined. The tool analyzes the predicate and suggests comparison values for which the overall pattern evaluates to true and false. Note: the suggestions are based on the selected operator. Change the operator to get suggestions other operators.

## Showcases
### TQPropRefiner with Manual Timebound Refinement
[![](https://markdown-videos.vercel.app/youtube/fy_vLCxptAs)](https://youtu.be/fy_vLCxptAs)

### TQPropRefiner with Automatic Timebound Refinement
[![](https://markdown-videos.vercel.app/youtube/OjZPbsXNw1g)](https://youtu.be/OjZPbsXNw1g)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
