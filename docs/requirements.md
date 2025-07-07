# This is the requirements document for the "Swiss Cheese Model(SCM) Helper" tool.

## Objective
The Swiss Cheese Model Helper tool has software engineers and incident postmortem facilitators as its primary audience. It is supposed to show an interactive model where the end users can click and identify the holes applicabe to each layer. An example illustration of the concept can be seen [here](https://static01.nyt.com/images/2020/12/08/science/08SCI-cheese-graphic-REV2/08SCI-cheese-graphic-REV2-superJumbo.png?quality=75&auto=webp). 
## Functional Requirements

### Displaying the initial view
0. This is the main visualisation. Assign it the html id "scm-visual". It should occupy 2/3 of the available width in its container. The rest 1/3 is designated for a details pane on the right of this visualization id for this container is "selected-layer-details".
1. Underlying data for the visualisation is available in the [data/layers.json](../data/layers.json)
2. For each "layer" object, 
    1. visualise it as a square sheet of cheese with some amount of thickness. 
    2. Multiple "layer" objects are to be displayed one behind the other. Refer to [this picture](../docs/swiss-cheese.jpg) for an example. Do not stack the layers one on top of the other vertically. Side by side with bit of overlap is the correct way.
    3. Make this thickness amount as a constant in the module that controls the visualisation. 
    4. The color of each of these layers is indicated in the "layer" object at its "color" attribute. When building the visualisation, use this value read from the object.
    5. The name of each "layer" object must be displayed on top of the layer itself.
    6. The holes on the body of the layer is to be displayed using the array of objects named "holes" in the layer object.
4. Each one of the layers must be displayed with some space between them so that the end user can hover on each of them
5. When an end user hovers on a layer, display a tooltip that has "name" of the layer as header, "description" of the layer as body text and the number of "holes" in a layer object as footer.
6. The tooltip mentioned above must disappear automatically when the user moves the mouse pointer away from a specific layer.
7. Do not apply any animation or transformation to the "layer" on hover
8. When the user clicks on a layer object (visualised as a sheet of cheese) that layer becomes active and this shoule be indicated with thicker lines on the sheet of cheese.

### Interactive features
1. When the end user clicks on a layer, display details of the layer on the right side pane with id "selected-layer-details"
2. The container "selected-layer-details" should have two parts. 
    2. One showing the details of the layer itself
        2. The header part should show name of the layer in the same color as the color property of the layer object
        2. In the body text, display the "description"
    2. The second one displaying details of the potential holes in it. This is to be implemented as an accordion.





## Non functional requirements

1. Do not use third party frameworks such as react, vue etc.
2. Do not use external third party API dependencies.
3. For storing data temporarily, use only what the web APIs that the browser provide
4. The code should be optimised for modularity. Related blocks of code can be abstracted into separate javascript files
5. Always use native javascript features
6. You are allowed to use D3 javascript library to build interactive visualisation.
7. All additional code must be added to the file index.html as children of the html element with id "layers-container".
8. An example for visualisation appears in [this file](../docs/swiss-cheese.jpg), use it as reference.