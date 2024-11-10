import axios from "axios";

const API_KEY = '46494071-58a02434dc7761124e9a04523';
const apiUrl = `https://pixabay.com/api/?key=${API_KEY}`;

const formatUrl = (params)=>{
    let url = apiUrl+'&per_page=25&safesearch=true&editors_choice=true'
    if(!params)return url;
    let paramKey = Object.keys(params);
    paramKey.map(key=>{
        let value = key=='q' ? encodeURIComponent(params[key]) : params[key];
        url += `&${key}=${value}`;
    }); 
    return url; 
}

export const apiCall = async (params)=>{
    try {
        const response = await axios.get(formatUrl(params));
        const {data} = response;
        return{success:true, data}
    } catch (error) {
        console.log("got error: ",error.message);
        return{success:false, message:error.message}
    }
}