type PopupType = {
  popupTitle: string;
  popupMessage: string;
  onClick: () => void;
};

const Popup = ({ popupTitle, popupMessage, onClick }: PopupType) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/40">
      <div className="bg-white shadow-lg text-center rounded-xl p-6 w-125">
        <h2 className="text-gray-900 text-lg font-semibold">{popupTitle}</h2>
        <p className="text-gray-600 mt-2">{popupMessage}</p>
        <button onClick={onClick} className="bg-black text-white rounded-lg mt-4 px-4 py-2">
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;
