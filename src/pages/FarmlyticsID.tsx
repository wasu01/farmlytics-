
import React, { useEffect, useState } from "react";

interface FormData {
  fullName?: string;
  aadhaar?: string;
  mobile?: string;
  dob?: string;
  age?: number;
  farmerPhotoBase64?: string;
  landArea?: string;
  village?: string;
  ulpin?: string;
  lpcType?: "upload" | "text";
  lpcFileBase64?: string;
  lpcText?: string;
  farmanalyticsNumber?: string;
}

type Page = "form1" | "form2" | "idCard";


const initialState: {
  currentPage: Page;
  formData: FormData;
} = {
  currentPage: "form1",
  formData: {}
};

const FarmlyticsID: React.FC = () => {
  const [state, setState] = useState(initialState);


  // Initialization and state loading from localStorage
  useEffect(() => {
    let formData: FormData = {};
    try {
      const saved = localStorage.getItem("farmlytics_form_data");
      if (saved) {
        formData = { ...formData, ...JSON.parse(saved) };
      }
    } catch {}
    setState((prev) => ({
      ...prev,
      formData,
      currentPage: formData.farmanalyticsNumber ? "idCard" : "form1"
    }));
  }, []);


  // Save form data to localStorage
  const saveFormData = (formData: FormData) => {
    localStorage.setItem("farmlytics_form_data", JSON.stringify(formData));
  };

  // --- FORM 1 ---
  const handleForm1Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fullName = (form.fullName as any).value.trim();
    const aadhaar = (form.aadhaar as any).value.trim();
    const mobile = (form.mobile as any).value.trim();
    const dob = (form.dob as any).value;
    const farmerPhotoBase64 = state.formData.farmerPhotoBase64;
    if (!fullName || !aadhaar.match(/^\d{12}$/) || !mobile || !dob || !farmerPhotoBase64) {
      alert("Please fill all fields and ensure Aadhaar is 12 digits.");
      return;
    }
    const age = Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    const newFormData = { ...state.formData, fullName, aadhaar, mobile, dob, age, farmerPhotoBase64 };
    await saveFormData(newFormData);
    setState((prev) => ({ ...prev, formData: newFormData, currentPage: "form2" }));
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setState((prev) => ({
        ...prev,
        formData: { ...prev.formData, farmerPhotoBase64: evt.target?.result as string }
      }));
    };
    reader.readAsDataURL(file);
  };

  // --- FORM 2 ---
  const handleForm2Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const landArea = (form.landArea as any).value.trim();
    const village = (form.village as any).value.trim();
    const ulpin = (form.ulpin as any).value.trim();
    const lpcType = (form.lpcType as any).value;
    let lpcValid = false;
    if (lpcType === "upload") {
      lpcValid = !!state.formData.lpcFileBase64;
    } else {
      lpcValid = !!state.formData.lpcText;
    }
    if (!landArea || !village || !ulpin.match(/^\d{14}$/) || !lpcValid) {
      alert("Please fill all fields and ensure ULPIN is 14 digits and LPC is provided.");
      return;
    }
    // Generate ID
    const yearSuffix = new Date().getFullYear().toString().slice(-2);
    const aadhaarLast4 = state.formData.aadhaar?.slice(-4) || "0000";
    const ulpinLast4 = ulpin.slice(-4);
    const random3 = Math.floor(100 + Math.random() * 900);
    const farmanalyticsNumber = `FA-${yearSuffix}-${aadhaarLast4}-${ulpinLast4}-${random3}`;
    const newFormData = { ...state.formData, landArea, village, ulpin, lpcType, farmanalyticsNumber };
    await saveFormData(newFormData);
    setState((prev) => ({ ...prev, formData: newFormData, currentPage: "idCard" }));
  };

  const handleLPCFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setState((prev) => ({
        ...prev,
        formData: { ...prev.formData, lpcFileBase64: evt.target?.result as string }
      }));
    };
    reader.readAsDataURL(file);
  };

  // --- RENDER ---


  if (state.currentPage === "form1") {
    return (
      <form onSubmit={handleForm1Submit} className="bg-white rounded-xl shadow-lg p-6 space-y-4 max-w-lg mx-auto mt-8">
        <h2 className="text-2xl font-bold text-green-700 mb-2">Personal Information</h2>
        <input required name="fullName" placeholder="Full Name" className="w-full border p-2 rounded" defaultValue={state.formData.fullName || ''} />
        <input required name="aadhaar" placeholder="Aadhaar (12 digits)" maxLength={12} pattern="\d{12}" className="w-full border p-2 rounded" defaultValue={state.formData.aadhaar || ''} />
        <input required name="mobile" placeholder="Mobile" className="w-full border p-2 rounded" defaultValue={state.formData.mobile || ''} />
        <input required name="dob" type="date" className="w-full border p-2 rounded" defaultValue={state.formData.dob || ''} />
        <div>
          <label className="block mb-1">Farmer Photo</label>
          <input type="file" accept="image/*" onChange={handlePhotoFileChange} className="block" />
          {state.formData.farmerPhotoBase64 && <img src={state.formData.farmerPhotoBase64} className="w-24 h-24 rounded-full mt-2 object-cover" alt="Farmer" />}
        </div>
        <button className="w-full bg-green-600 text-white py-2 rounded font-bold">Next</button>
      </form>
    );
  }

  if (state.currentPage === "form2") {
    return (
      <form onSubmit={handleForm2Submit} className="bg-white rounded-xl shadow-lg p-6 space-y-4 max-w-lg mx-auto mt-8">
        <h2 className="text-2xl font-bold text-green-700 mb-2">Land Information</h2>
        <input required name="landArea" placeholder="Land Area (in acres)" className="w-full border p-2 rounded" defaultValue={state.formData.landArea || ''} />
        <input required name="village" placeholder="Village" className="w-full border p-2 rounded" defaultValue={state.formData.village || ''} />
        <input required name="ulpin" placeholder="ULPIN (14 digits)" maxLength={14} pattern="\d{14}" className="w-full border p-2 rounded" defaultValue={state.formData.ulpin || ''} />
        <div>
          <label className="block mb-1">LPC Type</label>
          <label><input type="radio" name="lpcType" value="upload" checked={state.formData.lpcType !== 'text'} onChange={() => setState((prev) => ({ ...prev, formData: { ...prev.formData, lpcType: 'upload' } }))} /> Upload</label>
          <label className="ml-4"><input type="radio" name="lpcType" value="text" checked={state.formData.lpcType === 'text'} onChange={() => setState((prev) => ({ ...prev, formData: { ...prev.formData, lpcType: 'text' } }))} /> Text</label>
        </div>
        {state.formData.lpcType === 'text' ? (
          <div>
            <label className="block mb-1">LPC Text</label>
            <textarea className="w-full border p-2 rounded" value={state.formData.lpcText || ''} onChange={e => setState((prev) => ({ ...prev, formData: { ...prev.formData, lpcText: e.target.value } }))} />
          </div>
        ) : (
          <div>
            <label className="block mb-1">Upload LPC File</label>
            <input type="file" onChange={handleLPCFileChange} className="block" />
            {state.formData.lpcFileBase64 && <span className='text-green-600'>File uploaded</span>}
          </div>
        )}
        <button className="w-full bg-green-600 text-white py-2 rounded font-bold">Generate ID</button>
      </form>
    );
  }

  if (state.currentPage === "idCard") {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center space-y-4 max-w-lg mx-auto mt-8">
        <h2 className="text-2xl font-bold text-green-700 mb-2">Your Farmanalytics ID Card</h2>
        <div className="flex flex-col items-center">
          {state.formData.farmerPhotoBase64 && <img src={state.formData.farmerPhotoBase64} className="w-24 h-24 rounded-full object-cover border-4 border-green-200 mb-2" alt="Farmer" />}
          <div className="text-lg font-bold text-gray-800">{state.formData.fullName}</div>
          <div className="text-gray-600">ID: <span className="font-mono">{state.formData.farmanalyticsNumber}</span></div>
          <div className="text-gray-600">Age: {state.formData.age}</div>
          <div className="text-gray-600">ULPIN: {state.formData.ulpin}</div>
        </div>
        <button className="mt-4 bg-green-600 text-white py-2 px-4 rounded font-bold" onClick={() => setState((prev) => ({ ...prev, currentPage: "form1" }))}>Start New / Edit Data</button>
      </div>
    );
  }

  return null;
};

export default FarmlyticsID;
