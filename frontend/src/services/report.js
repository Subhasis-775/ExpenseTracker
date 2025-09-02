import API from "./api.js";
const downloadReport=async(month,year)=>{
    try {
        const res=await API.get(`/reports?month=${month}&year=${year}`,{
            responseType:"blob"
        })
        const url=window.URL.createObjectURL(new Blob([res.data]));
        const link=document.createElement("a");
        link.href=url;
        link.setAttribute("download",`report-${month}-${year}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("error downloading eport:",error);
    }
};
export default downloadReport;