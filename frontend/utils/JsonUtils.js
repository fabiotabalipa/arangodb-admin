export const downloadObjectAsJson = (object, exportName) => {
    const dataString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(object, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataString);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};
