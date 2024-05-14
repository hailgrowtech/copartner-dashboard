import { FaAngleLeft, FaPen } from "react-icons/fa";
import PageHeader from "../Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import Bin from "../../assets/TrashBinMinimalistic.png";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import AgencyPopup from "./AgencyPopup";

const AgencyID = () => {
  const navigate = useNavigate();
  const { agencyId } = useParams();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [agencies, setAgencies] = useState([]);

  useEffect(() => {
    fetchAgency();
  }, []);

  const fetchAgency = async () => {
    try {
      const response = await fetch(
        `https://copartners.in:5134/api/ExpertsAdvertisingAgency/${agencyId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAgencies(data.data);
    } catch (error) {
      console.error("Fetching error:", error);
      toast.error(`Failed to fetch agency: ${error.message}`);
    }
  };

  const handleDeleteAgency = (id) => {
    const updatedAgencies = agencies.filter((agency) => agency.id !== id);
    setAgencies(updatedAgencies);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedAgency(null);
  };

  const handleEditAgency = (agency) => {
    setSelectedAgency(agency);
    setIsPopupOpen(true);
  };

  const handleSubmit = (formData) => {
    if (selectedAgency) {
      const updatedAgencies = agencies.map((a) =>
        a.id === selectedAgency.id ? { ...a, ...formData } : a
      );
      setAgencies(updatedAgencies);
    } else {
      const newAgency = {
        id: agencies.length + 1,
        ...formData,
      };
      setAgencies([...agencies, newAgency]);
    }
    setIsPopupOpen(false);
  };
  return (
    <div className="dashboard-container p-0 sm:ml-60">
      <PageHeader
        title="Agency"
        searchQuery=""
        setSearchQuery={() => {}}
        hasNotification={false}
        setHasNotification={() => {}}
      />

      <div className="back-button flex items-center text-2xl font-bold p-6">
        <button
          style={{ display: "flex", alignItems: "center" }}
          onClick={() => navigate(-1)}
        >
          <FaAngleLeft />
          <span className="ml-1">Back</span>
        </button>
      </div>

      <div className="requestContainer mx-5 bg-[#fff]">
        <div className="channel-heading flex">
          <h3 className="text-xl font-semibold mr-auto">Ad Agency</h3>
          <button
            className="border-2 border-black rounded-lg px-4 py-1 mr-4"
            onClick={() => setIsPopupOpen(true)}
          >
            + Add
          </button>
        </div>
        <div className="py-4 px-8">
          <table className="table-list">
            <thead>
              <tr className="requestColumns">
                <th
                  style={{ textAlign: "left", paddingLeft: "4rem" }}
                  className="text-left"
                >
                  RA Name
                </th>
                <th style={{ textAlign: "left" }}>Link</th>
                <th style={{ textAlign: "left" }}>User</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {agencies.map((agency) => (
                <tr key={agency.id} className="request-numbers font-semibold">
                  <td
                    style={{ textAlign: "left", paddingLeft: "4rem" }}
                    className="p-3"
                  >
                    {agency.agencyName}
                  </td>
                  <td style={{ textAlign: "left" }} className="p-3">
                    {agency.link}
                  </td>
                  <td
                    style={{ textAlign: "left" }}
                    className="p-3 text-center text-blue-400"
                  >
                    {agency.usersCount}
                  </td>
                  <td className="flex justify-center items-center gap-6">
                    <FaPen
                      className="text-blue-600 cursor-pointer"
                      onClick={() => handleEditAgency(agency)}
                    />
                    <img
                      className="w-6 h-6 cursor-pointer"
                      src={Bin}
                      alt="Delete"
                      onClick={() => handleDeleteAgency(agency.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isPopupOpen && (
        <AgencyPopup
          onClose={handleClosePopup}
          selectedAgency={selectedAgency}
          onSubmit={handleSubmit}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default AgencyID;
