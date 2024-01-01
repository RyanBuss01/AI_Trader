const socket = io(window.parent.serverPath);

let loaderdoc = document.getElementById('loadedText')

let params = []
let savedParams = []
let vars = {}


function addFunctionToIndicators() {
    loaderdoc.innerText = "Uploading..."
    let doc = document.getElementById('uploadError')
    if(canUpload()) {
        doc.innerHTML = ""
        var code = editor.getValue();
        var functionName = document.getElementById('functionName').value.trim();
        var functionLabel = document.getElementById('functionLabel').value.trim();
        var allowBars = document.getElementById('allowBarCheckBox').checked
        var isDataOption = document.getElementById('allowDataCheckBox').checked
        var isSet = document.getElementById('isSetReturn').checked
        var description = document.getElementById('description').value.trim()
        let data = {name: functionName, label: functionLabel, code:code, params: savedParams, allowBars: allowBars, description: description, isDataOption: isDataOption, isSet: isSet}
        socket.emit('createFunc', data)
    }
    else {
        doc.innerHTML = "Error uploading, not all data is filled"
    }
}

function addParameter() {
    params.push({
        name: '',
        label: '',
        type: '',
        default: null,
        tester: null,
        options: []
    })

    displaySave()
    updateParams()

}

function createParameterElemet(param) {
    const select = document.createElement('select');
    select.addEventListener('change', function () {
        param.type = this.options[this.selectedIndex].value
        updateParams()
    });

    const blank = document.createElement('option');
    blank.value = '';
    blank.textContent = '';

    const dropdown = document.createElement('option');
    dropdown.value = 'dropdown';
    dropdown.textContent = 'Dropdown';

    const number = document.createElement('option');
    number.value = 'number';
    number.textContent = 'Number';

    const check = document.createElement('option');
    check.value = 'bool';
    check.textContent = 'Boolean';

    select.appendChild(blank)
    select.appendChild(dropdown)
    select.appendChild(number)
    select.appendChild(check)

    if(param.type != '') select.value = param.type

    return select

}

function createParamHTML(param, i) {
    var newDiv = document.createElement('div')
    newDiv.className = 'create-parameter'

    // Creating elements
    var selectElement = createParameterElemet(param);
    var nameInput = document.createElement('input');
    nameInput.className = 'param-input';
    nameInput.value = param.name;
    nameInput.addEventListener('change', ()=>param.name=nameInput.value)

    var labelInput = document.createElement('input');
    labelInput.className = 'param-input';
    labelInput.value = param.label;
    labelInput.addEventListener('change', ()=>param.label=labelInput.value)

    var deleteButton = document.createElement('button')
        deleteButton.className = 'red-x-button'
        deleteButton.addEventListener('click', () => {
            params.splice(i, 1);
            updateParams()
        })

    var nameLabelPair = createInputLabelPair('In code name', nameInput);
    var labelLabelPair = createInputLabelPair('Display Name', labelInput);

    newDiv.appendChild(selectElement);
    newDiv.appendChild(nameLabelPair);
    newDiv.appendChild(labelLabelPair);
    newDiv.appendChild(deleteButton);

    if (param.type == 'dropdown') {
        var addButton = document.createElement('button');
        addButton.textContent = "Add option";
        addButton.addEventListener('click', () => {
            param.options.push({ name: '', label: '' });
            updateParams();
        });

        var optionsDiv = document.createElement('div');
        for (let i = 0; i < param.options.length; i++) {
            var optionNameInput = document.createElement('input');
            optionNameInput.value = param.options[i].name;
            optionNameInput.addEventListener('change', () =>  {
                param.options[i].name = optionNameInput.value
            })
            var optionLabelInput = document.createElement('input');
            optionLabelInput.value = param.options[i].label;
            optionLabelInput.addEventListener('change', () => param.options[i].label = optionLabelInput.value)

            var optionNamePair = createInputLabelPair('Name', optionNameInput);
            var optionLabelPair = createInputLabelPair('Label', optionLabelInput);
            
            optionsDiv.appendChild(optionNamePair);
            optionsDiv.appendChild(optionLabelPair);
        }



        newDiv.appendChild(addButton);
        newDiv.appendChild(optionsDiv);

    } 

    return newDiv;
}

function updateParams() {
    vars = {}
    var divParam = document.getElementById('Parameter')
    divParam.innerHTML = ''
    for(let i=0; i<params.length; i++) {
        divParam.appendChild(createParamHTML(params[i], i))
    }
}

function canSave() {
    for(p of params) {
    if(p.name=='') return false
    if(p.label=='') return false
    if(p.type=='') return false
    if(p.type == 'dropdown') {
        if(p.options.length<2) return false
        for(o of p.options) {
            if(o.name == '') return false
            if(o.label == '') return false
        }
    }
    }

    return true
}

function canUpload() {
    var namDoc = document.getElementById('functionName')
    var labDoc = document.getElementById('functionLabel')
    if(namDoc.value == '') return false
    if(labDoc.value == '') return false

    for(p of savedParams) {
        if(p.name == '') return false
        if(p.label == '') return false
        if(p.default == null) return false
        if(p.type == '') return false
    }

    return true
}

function displaySave() {
    var doc = document.getElementById('saveDiv')
    if(doc.innerHTML.trim() === "") {
    var button = document.createElement('button')
    button.id ='save'
    button.innerHTML = "Save"
    button.className = "save"
    button.addEventListener('click', () => save())
    doc.appendChild(button)
    }
}

function save() {
    var doc = document.getElementById('error')
    if(canSave()) {
        doc.innerHTML = ""
    for(p of params) savedParams.push(p)
    params = []
    document.getElementById('Parameter').innerHTML = ''
    document.getElementById('saveDiv').innerHTML = ''
    updateSavedParams()
    }
    else {
        doc.innerHTML = "Not all values filled"
    }

}

function updateSavedParams () {
    var paramDiv = document.getElementById('SavedParameter')
    paramDiv.innerHTML = ""
    for (let i=0; i<savedParams.length; i++) {
        let p = savedParams[i]
        if(!p) continue
        var element = document.createElement('div')
        element.className = 'savedParamDisplay'
        if(p.type=='dropdown') {
            var dropdown = document.createElement('select')
            var baseOption = document.createElement('option')
                baseOption.value = ``
                baseOption.label = ``
                dropdown.appendChild(baseOption)
            for(o of p.options) {
                var option = document.createElement('option')
                option.value = o.name
                option.label = `${o.label} (${o.name})`
                dropdown.appendChild(option)
            }
            dropdown.addEventListener('change', function () {
                savedParams[i].default=this.value
                assaignVar()
            })
            dropdown = createInputLabelPair(`${p.label} (${p.name})`, dropdown)
            element.appendChild(dropdown)
        } else if(p.type =='number') {
            var input = document.createElement('input')
            input.type = 'number'
            input.placeholder = 'Default value'
            input.addEventListener('change', function () {
                savedParams[i].default=this.value
                assaignVar()
            })
            input = createInputLabelPair(`${p.label} (${p.name})`, input)
            element.appendChild(input)
        }

        var closeButton = document.createElement('button')
        closeButton.className = 'red-x-button'
        closeButton.addEventListener('click', () => {
            savedParams.splice(i, 1)
            updateSavedParams()
        })
        element.appendChild(closeButton)
        paramDiv.appendChild(element)
    }
}

function createInputLabelPair(text, input) {
    var label = document.createElement('label');
    label.textContent = text;
    label.appendChild(input);
    input.className = 'param-input'
    return label;
}

function assaignVar() { 
    for(p of savedParams) 
    {
        vars[p.name] = p.default
    }

}

socket.on('createIndicator', (data) => {

    if(data.res) {
        loaderdoc.innerText = "Uploaded Successfully"
    }

    if(data.res == false) {
    let docError = document.getElementById('uploadError')
    docError.innerHTML = `Error uploading, ${data.error}`
    }
})