function disableEvents()
{
    var imgElems = document.getElementsByTagName("img");
    var i=0;
    for(i=0;i<imgElems.length;i++)
    {
        imgElems[i].style.webkitTouchCallout='none';
        imgElems[i].style.KhtmlUserSelect='none' ;
    }
}

function disableCalloutForAnchorTags()
{
    var aTags = document.getElementsByTagName("a");
    var i=0;
    for(i=0;i<aTags.length;i++)
    {
        if(aTags[i].href.includes('http')){
            aTags[i].style.webkitTouchCallout='none';
            aTags[i].style.KhtmlUserSelect='none' ;
        }
    }
    
}

