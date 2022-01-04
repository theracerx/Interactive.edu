window.PANOLENS = require("panolens")
require("@google/model-viewer")


const MISC = {
    waitUndefinedElem : (clsName,index)=>{
        return new Promise((resolve)=>{
            let wait = setInterval(() => {
                if(typeof(document.getElementsByClassName(clsName)[index]) != "undefined"){
                    clearInterval(wait)
                    resolve()
                }
            }, 250);
        })
    },
    addMETAViewport:(header)=>{
        let viewport = MISC.newElem("meta",".")
        viewport.name = "viewport"
        viewport.content = "width=device-width, initial-scale=1.0"
        header.appendChild(viewport)
    },
    addScript: async(url,clsName,header)=>{
        return new Promise (async(resolve)=>{
            let scriptText = await MISC.getURLTextContent(url)
            let scriptCont = MISC.newElem("script","." + clsName)
            scriptCont.innerHTML = scriptText
            header.appendChild(scriptCont)
            resolve()
        })
    },
    addConfigScript:async(src,header)=>{
        return new Promise (async(resolve)=>{
            let url = src.getAttribute("config-url")
            url.includes("http")? url = url
            : url.charAt(0) == "/" ? url = window.location.origin + url
            : url = window.location.origin + "/" + url
            
            await MISC.addScript(url,"CONFIG",header)
            resolve()
        })
    },
    addScriptModule: async(url,clsName,header)=>{
        let scriptText = await MISC.getURLTextContent(url)
        let scriptCont = MISC.newElem("script","." + clsName)
        scriptCont.setAttribute("type","module")
        scriptCont.innerHTML = scriptText
        header.appendChild(scriptCont)
    },
    getURLTextContent: (url)=>{
        return new Promise((resolve)=>{
            fetch(url)
            .then(result => result.text())
            .then(text => resolve(text))
        })
    },
    addCss: async(url,clsName,header)=>{
        let cssContent = await MISC.getURLTextContent(url)
        let cssCont = MISC.newElem("style","." + clsName)
        cssCont.type = "text/css"
        cssCont.innerHTML = cssContent
        header.appendChild(cssCont)
    },
    newElem: (type,identity,innerText)=>{
        let nElem = document.createElement(type)
        typeof(identity) == "string" ? 
            identity.includes("#") ? nElem.setAttribute("id",identity.substring(1))
            : identity.includes(".") ? nElem.setAttribute("class",identity.substring(1))
            : nElem = "newElem 'identity' must follow jQuery class('."+ identity +"') and id('#"+ identity +"') syntax"
        : nElem = "newElem 'identity' must be a 'string'";
    
        typeof(innerText) != "undefined" && typeof(nElem) == "object" ?
            ["string","number"].includes(typeof(innerText)) ? nElem.innerText = innerText
            : nElem = "newElem 'innertext' must either be a 'string' or 'number' only"
        : null
    
        if(typeof(nElem) == "object") return nElem
        else throw new Error (nElem)
    },
    updateCls: (trgtElem,args)=>{
        let addCls = (item)=>!trgtElem.classList.contains(item.slice(1))?trgtElem.classList.add(item.slice(1)):null;
        let subCls = (item)=>trgtElem.classList.contains(item.slice(1))?trgtElem.classList.remove(item.slice(1)):null;
        let verCls = (item)=>{
            !item.includes(" ")?
                item.charAt(0) == "-"?
                    subCls(item)
                : item.charAt(0) == "+"?
                    addCls(item)
                : MISC.throwError("place '+' or '-' infront of the className to be add or removed")
            : MISC.throwError("className: " + args + " must not have any 'space'")

            if(item instanceof Error) throw item
        }
        let chkClsArray = (args)=>{
            for(let i=0;i<args.length;i++){
                typeof(args[i]) == "string"? verCls(args[i])
                : MISC.throwError("items of 'args' of updateCls must be a 'string' only")
            } 
        }
    
        typeof(trgtElem) != "undefined"?
            Array.isArray(args)?chkClsArray(args)
            : typeof(args) == "string"?verCls(args)
            : MISC.throwError("'args' of updateCls can be an 'array' or 'string'")
        : MISC.throwError("trgtElem is 'undefined' on updateCls")
    },
    throwError:(string)=>{
        typeof(string)=="string"?
            string = new Error(string)
        : string = new Error("throwError only accepts 'string'")

        throw string
    }
}