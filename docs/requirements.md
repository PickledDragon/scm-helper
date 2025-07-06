# This is the requirements document for the "Swiss Cheese Model(SCM) Helper" tool.

## Objective
The Swiss Cheese Model Helper tool has software engineers and incident postmortem facilitators as its primary audience. It is suppossed to show an interactive model where the end users can click and identify the holes applicabe to each layer. An example illustration of the concept can be seen [here](https://static01.nyt.com/images/2020/12/08/science/08SCI-cheese-graphic-REV2/08SCI-cheese-graphic-REV2-superJumbo.png?quality=75&auto=webp). 
## Functional Requirements

1. Underlying data for the visualisation is available in the [data/layers.json](../data/layers.json)
2. All the applicable layers that must be visualised appears as independent records under the key "layers". Each of these layers must be visualised as independent layers in the final output.

## Non functional requirements

1. NF-01: Do not use third party frameworks such as react, vue etc.
2. NF-02: Do not use external third party API dependencies.
3. NF-03: For storing data temporarily, use only what the web APIs that the browser provide
4. NF-04: The code should be optimised for modularity. Related blocks of code can be abstracted into separate javascript files
5. NF-05: Always use native javascript features
6. You are allowed to use D3 javascript library to build interactive visualisation.
7. All additional code must be added to the file index.html as children of the html element with id "main-container". 