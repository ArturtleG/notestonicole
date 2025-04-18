function dateToString(date){
    //let dateObj = new Date(date);
    console.log(date);
    let dateObj = centralDate(date);
    let dateString = dateObj.toDateString();

    const commaIndex = dateString.length - 4;
    dateString = dateString.substring(0, commaIndex-1) + ", " + dateString.substring(commaIndex);
    return dateString;
}

function isToday(dateString) {
    // Get today's date
    const today = centralDate();
    const todayFormatted = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    

    // Compare the given date string with today's formatted date
    return dateString === todayFormatted;
}

function centralDate(date=false){
    
    let dateObj;
    let dir;
    
    if(!date){
        dateObj = new Date();
        dir = 1;
    } else{
        dateObj = new Date(date);
        dir = -1;
    }
    
    return new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60 * 1000 * dir);
}

function convertText(input){
    input = setComment(input);
    input = setSuperscript(input);
    input = setNewLine(input);
    input = setSmall(input);
    
    return input;
}

function setComment(input){
    return replace(input, "*", "comment");
}

function setSuperscript(input){
    return replace(input, "^", "sup", "sup");
}

function setNewLine(input){
    return replace(input, "n", "", "div");
}

function setSmall(input){
    return replace(input, "s", "small");
}

function replace(input, char, type, element="span"){
    let start = `/${char}`;
    let end = `${char}/`;

    // Escape special characters in delimiters
    let escapedStart = start.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    let escapedEnd = end.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    // Construct the regular expression dynamically
    let regExp = new RegExp(escapedStart + "(.*?)" + escapedEnd, "g");

    // Replace matched text with a <span> containing the class
    
    return input.replace(regExp, `<${element} class="${type}">$1</${element}>`);
}