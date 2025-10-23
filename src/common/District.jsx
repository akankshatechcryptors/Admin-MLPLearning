import React,{useState,useEffect} from 'react';
import { Autocomplete, TextField, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
const stateDistricts = {
  "Other":["Other"],
    "Andhra Pradesh": [
      "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool",
      "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "West Godavari",
      "YSR Kadapa"
    ],
    "Arunachal Pradesh": [
      "Changlang", "East Kameng", "East Siang", "Kra Daadi", "Kurung Kumey",
      "Lepa Rada", "Lower Dibang Valley", "Lower Subansiri", "Namsai", "Papum Pare",
      "Siang", "Tawang", "Tirap", "Upper Dibang Valley", "Upper Siang",
      "Upper Subansiri", "West Kameng", "West Siang"
    ],
    "Assam": [
      "Barpeta", "Bongaigaon", "Cachar", "Darrang", "Dhemaji",
      "Dibrugarh", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur",
      "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar",
      "Sonitpur", "Tinsukia", "Udalguri"
    ],
    "Bihar": [
      "Aurangabad", "Araria", "Arwal", "Banka", "Begusarai",
      "Bhagalpur", "Buxar", "Darbhanga", "Gaya", "Gopalganj",
      "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria",
      "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger",
      "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia",
      "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura",
      "Sheohar", "Sitamarhi", "Supaul", "Vaishali", "West Champaran"
    ],
    "Chhattisgarh": [
      "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband",
      "Janjgir-Champa", "Jashpur", "Korba", "Koriya", "Raigarh",
      "Raipur", "Rajnandgaon", "Sukma", "Surguja"
    ],
    "Goa": [
      "North Goa", "South Goa"
    ],
    "Gujarat": [
      "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha",
      "Bharuch", "Bhavnagar", "Dahod", "Dang", "Gandhinagar",
      "Gir Somnath", "Jamnagar", "Junagadh", "Kutch", "Mahisagar",
      "Mehsana", "Narmada", "Navsari", "Panchmahal", "Patan",
      "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar",
      "Tapi", "Vadodara", "Valsad"
    ],
    "Haryana": [
      "Ambala", "Bhiwani", "Faridabad", "Fatehabad", "Gurgaon",
      "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal",
      "Mahendragarh", "Mewat", "Panchkula", "Panipat", "Rewari",
      "Sirsa", "Sonipat", "Yamunanagar"
    ],
    "Himachal Pradesh": [
      "Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur",
      "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur",
      "Solan", "Una"
    ],
    "Jharkhand": [
      "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka",
      "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla",
      "Hazaribagh", "Jamtara", "Koderma", "Latehar", "Lohardaga",
      "Pakur", "Palamu", "Ranchi", "Sahibganj", "Seraikela-Kharsawan",
      "West Singhbhum"
    ],
    "Karnataka": [
      "Bagalkote", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban",
      "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikmagalur", "Chitradurga",
      "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan",
      "Haveri", "Kodagu", "Kolar", "Koppal", "Mandya",
      "Mysuru", "Raichur", "Ramanagara", "Shimoga", "Tumkur",
      "Udupi", "Uttara Kannada", "Yadgir"
    ],
    "Kerala": [
      "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod",
      "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad",
      "Pathanamthitta", "Thrissur", "Wayanad"
    ],
    "Madhya Pradesh": [
      "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind",
      "Bhopal", "Burhanpur", "Chhindwara", "Damoh", "Datiya",
      "Dewas", "Dhar", "Guna", "Gwalior", "Harda",
      "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni",
      "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena",
      "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh",
      "Ratlam", "Rewa", "Sagar", "Satna", "Sehore",
      "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri",
      "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"
    ],
    "Maharashtra": [
      "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed",
      "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli",
      "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur",
      "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded",
      "Nandurbar", "Nasik", "Osmanabad", "Palghar", "Parbhani",
      "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara",
      "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim",
      "Yavatmal"
    ],
    "Manipur": [
      "Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West",
      "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney",
      "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal",
      "Ukhrul"
    ],
    "Meghalaya": [
      "East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills",
      "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills",
      "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"
    ],
    "Mizoram": [
      "Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei",
      "Mamit", "Serchhip", "Siaha", "Saiha"
    ],
    "Nagaland": [
      "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung",
      "Mon", "Peren", "Phek", "Tuensang", "Wokha",
      "Zunheboto"
    ],
    "Odisha": [
      "Angul", "Bargarh", "Boudh", "Cuttack", "Debagarh",
      "Dhenkanal", "Ganjam", "Gajapati", "Jagatsinghpur", "Jajpur",
      "Jeypore", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar",
      "Khurda", "Koraput", "Malkangiri", "Nabarangpur", "Nayagarh",
      "Nuapada", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"
    ],
    "Punjab": [
      "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib",
      "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala",
      "Ludhiana", "Mansa", "Moga", "Muktsar", "Nawanshahr",
      "Patiala", "Rupnagar", "Sangrur", "SAS Nagar", "Sri Muktsar Sahib",
      "Sri Amritsar Sahib"
    ],
    "Rajasthan": [
      "Ajmer", "Alwar", "Banswara", "Baran", "Barmer",
      "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Dausa",
      "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer",
      "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli",
      "Nagaur", "Pali", "Rajsamand", "Sawai Madhopur", "Sikar",
      "Sri Ganganagar", "Tonk", "Udaipur"
    ],
    "Sikkim": [
      "East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"
    ],
    "Tamil Nadu": [
      "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
      "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram",
      "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Nagapattinam",
      "Namakkal", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet",
      "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni",
      "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur",
      "Tiruvallur", "Tiruvannamalai", "Vellore", "Viluppuram", "Virudhunagar"
    ],
    "Telangana": [
      "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangoan",
      "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam",
      "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri",
      "Nagarkurnool", "Nalgonda", "Nirmal", "Nizamabad", "Peddapalli",
      "Rajanna Sircilla", "Ranga Reddy", "Warangal Rural", "Warangal Urban", "Wanaparthy",
      "Warangal"
    ],
    "Tripura": [
      "Dhalai", "Khowai", "North Tripura", "Sepahijala", "South Tripura",
      "Unakoti", "West Tripura"
    ],
    "Uttar Pradesh": [
      "Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi",
      "Amroha", "Auraiya", "Azamgarh", "Baghpat", "Bahraich",
      "Ballia", "Balrampur", "Banda", "Bareilly", "Basti",
      "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot",
      "Deoria", "Etah", "Etawah", "Faizabad", "Farrukhabad",
      "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghazipur", "Gonda",
      "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras",
      "Jalaun", "Jaunpur", "Jhansi", "Jhansi", "Kannauj",
      "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kushinagar",
      "Lakhimpur Kheri", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba",
      "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur",
      "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Rae Bareli",
      "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Sant Ravidas Nagar",
      "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur",
      "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
    ],
    "Uttarakhand": [
      "Almora", "Bageshwar", "Bhimtal", "Chamoli", "Champawat",
      "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh",
      "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"
    ],
    "West Bengal": [
      "Alipurduar", "Bankura", "Bardhaman", "Birbhum", "Dakshin Dinajpur",
      "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram",
      "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas",
      "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur",
      "Purulia", "South 24 Parganas", "Uttar Dinajpur"
    ]
  }
  

const DistrictDropdown = ({ selectedState, value, handleChange, imp }) => {
  const [options, setOptions] = useState([]);

  // Load districts when state changes
  useEffect(() => {
    if (selectedState && stateDistricts[selectedState]) {
      setOptions(stateDistricts[selectedState]);
    } else {
      setOptions([]);
    }
     if (selectedState === "Other") {
      handleChange({ target: { name: "district", value: "Other" } });
    }
  }, [selectedState]);

  // Handle changes (and add new district if typed manually)
  const handleDistrictChange = (event, newValue) => {
    if (newValue && !options.includes(newValue)) {
      setOptions((prev) => [...prev, newValue]);
    }
    handleChange({ target: { name: "districts", value: newValue } });
  };

  return (
    <>
      <Autocomplete
      fullWidth
        key={selectedState} // re-render when state changes
        freeSolo
       disabled={!selectedState || selectedState === "Other"} // disable if "Other"
        options={options}
        value={value || ""}
        onChange={(event, newValue) => handleDistrictChange(event, newValue)}
        onInputChange={(event, newInputValue) => {
          if (event && event.type === "change") {
            handleChange({ target: { name: "districts", value: newInputValue } });
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={
              <>
                District {imp && <span style={{ color: "red" }}> *</span>}
              </>
            }
            placeholder={
              selectedState
                ? "Search or add a district"
                : "Select a state first"
            }
            variant="outlined"
            fullWidth
          />
        )}
      />
    </>
  );
};

  
  export default DistrictDropdown;