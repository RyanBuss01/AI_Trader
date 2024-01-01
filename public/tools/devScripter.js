var editor

function initializeEditor()  {
    editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        mode: "javascript",
        theme: "dracula",
        extraKeys: {"Ctrl-Space": "autocomplete"}, // enable autocomplete on Ctrl-Space
    });

    editor.on("keyup", function (cm, event) {
        if (!cm.state.completionActive && !event.ctrlKey && !event.metaKey && (event.keyCode > 64 && event.keyCode < 91)) { // keys a-z
            CodeMirror.commands.autocomplete(cm, null, { completeSingle: false });
        }
    });

    var defaultCode = 
`// Default: AAPL used as sample data

let close = bars[bars.length-1].ClosePrice
let yesterday = bars[bars.length-2].ClosePrice

console.log(close)
    

// Must return boolean for each of the following
return {
  bullBuy : close>yesterday,
  bearBuy : close<yesterday,
  
  // If no sell signal is desired set both to null
  bullSell : close<yesterday, 
  bearSell : close>yesterday,

  // If is set type
  set : true
}`;

    editor.setValue(defaultCode);

    var oldLog = console.log;
    var consoleOutput = document.getElementById("console-output");

    console.log = function(message) {
        consoleOutput.textContent += message + '\n';
        oldLog.apply(console, arguments);
    };

    window.runCode = function() {
        try {
            eval(editor.getValue());
        } catch (e) {
            console.error(e);
        }
    }
    
};

document.addEventListener('DOMContentLoaded', (event) => {
    if (document.getElementById("code")) {
        initializeEditor();
    }
});


function runScript() {
    var code = editor.getValue()
    var func = new Function(code);
    var isSet = document.getElementById('isSetReturn').checked
    document.getElementById('console-output').innerHTML = ""
    let res = func();
    if(isSet) {
        console.log(
            `\n\nResults: ${res.set}`
        )
    }else {
    console.log(
    `\n
Results:
Buy Bull signal: ${res.bullBuy}
Buy Bear signal: ${res.bearBuy}
Sell Bull signal: ${res.bullSell}
Sell Bear signal: ${res.bearSell}`
    )
    }
}

window.initializeEditor = initializeEditor;