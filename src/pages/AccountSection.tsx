import React from 'react';

interface AccountSectionProps {
  className?: string;
}

export const AccountSection: React.FC<AccountSectionProps> = ({ className = '' }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    username: 'master_1573',
    email: 'masterdannyshan@gmail.com'
  });
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [confirmText, setConfirmText] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Account Info Handlers
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    setIsEditing(false);
    console.log('Saving account info:', formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    setFormData({
      username: 'master_1573',
      email: 'masterdannyshan@gmail.com'
    });
  };

  // Danger Zone Handlers
  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      alert('Please type "DELETE" to confirm account deletion.');
      return;
    }

    setIsDeleting(true);
    
    // Simulate API call
    setTimeout(() => {
      alert('Account deletion initiated. You will be logged out shortly.');
      setIsDeleting(false);
      setShowConfirmDialog(false);
      setConfirmText('');
    }, 2000);
  };

  const openDeleteDialog = () => {
    setShowConfirmDialog(true);
  };

  const closeDeleteDialog = () => {
    setShowConfirmDialog(false);
    setConfirmText('');
  };

  return (
    <div className={`min-h-[600px] bg-black text-white ${className}`}>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Account Information Section */}
        <section className="w-full max-md:max-w-full">
          <div className="flex w-full items-center gap-2 text-lg text-[rgba(242,242,242,1)] font-semibold leading-loose flex-wrap max-md:max-w-full">
            <img
              src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/81d9baabdc17b279e86e04c9b874120ae3a0ffd0?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
              alt="Account info icon"
            />
            <h3 className="self-stretch my-auto">Account Information</h3>
          </div>
          
          <div className="bg-[rgba(17,17,17,1)] border w-full mt-4 p-6 rounded-lg border-[rgba(255,71,156,0.6)] border-solid max-md:max-w-full max-md:px-5">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="w-full pt-0.5 max-md:max-w-full">
                <label className="text-[rgba(153,153,153,1)] text-sm font-medium leading-none block mb-2">
                  Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="w-full text-base text-[rgba(230,230,230,1)] font-normal bg-transparent border border-[rgba(74,85,101,1)] rounded px-3 py-2 focus:outline-none focus:border-[rgba(255,71,156,1)] transition-colors max-md:max-w-full"
                    required
                  />
                ) : (
                  <div className="w-full text-base text-[rgba(230,230,230,1)] font-normal max-md:max-w-full">
                    {formData.username}
                  </div>
                )}
              </div>
              
              <div className="w-full mt-4 pt-0.5 max-md:max-w-full">
                <label className="text-[rgba(153,153,153,1)] text-sm font-medium leading-none block mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full text-base text-[rgba(230,230,230,1)] font-normal bg-transparent border border-[rgba(74,85,101,1)] rounded px-3 py-2 focus:outline-none focus:border-[rgba(255,71,156,1)] transition-colors max-md:max-w-full"
                    required
                  />
                ) : (
                  <div className="w-full text-base text-[rgba(230,230,230,1)] font-normal max-md:max-w-full">
                    {formData.email}
                  </div>
                )}
              </div>
              
              {isEditing ? (
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="bg-[rgba(255,71,156,1)] text-white px-4 py-2 rounded-md hover:bg-[rgba(255,71,156,0.8)] transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="mt-6 bg-[rgba(255,71,156,1)] text-white px-4 py-2 rounded-md hover:bg-[rgba(255,71,156,0.8)] transition-colors"
                >
                  Edit Information
                </button>
              )}
            </form>
          </div>
        </section>

        {/* Danger Zone Section */}
        <section className="w-full mt-8 max-md:max-w-full">
          <h3 className="w-full text-lg text-[rgba(242,242,242,1)] font-semibold leading-loose max-md:max-w-full">
            Danger Zone
          </h3>
          <p className="w-full text-sm text-[rgba(153,153,153,1)] font-normal leading-none mt-2 max-md:max-w-full">
            Irreversible and destructive actions
          </p>
          
          <div className="bg-[rgba(17,17,17,1)] border flex w-full items-center gap-[40px_100px] justify-between flex-wrap mt-2 pt-8 pb-6 px-6 rounded-lg border-[rgba(255,71,156,0.6)] border-solid max-md:max-w-full max-md:px-5">
            <div className="self-stretch w-[218px] my-auto">
              <h4 className="w-full text-base text-[rgba(242,242,242,1)] font-medium">
                Delete Account
              </h4>
              <p className="w-full text-sm text-[rgba(153,153,153,1)] font-normal leading-none mt-1">
                Permanently delete your account.
              </p>
            </div>
            
            <div className="self-stretch min-h-10 my-auto pl-4">
              <button
                onClick={openDeleteDialog}
                className="bg-[rgba(239,68,68,0.2)] flex min-h-10 items-center gap-2 justify-center px-4 py-2.5 rounded-md hover:bg-[rgba(239,68,68,0.3)] transition-colors"
              >
                <div className="self-stretch flex min-h-4 flex-col w-6 my-auto pr-2">
                  <div className="flex min-h-4 w-4 flex-col overflow-hidden items-center justify-center">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/f60683250b19aadde0b1152277cd6e5c45919b62?placeholderIfAbsent=true"
                      className="aspect-[1] object-contain w-full flex-1"
                      alt="Delete icon"
                    />
                  </div>
                </div>
                <span className="text-red-400 text-sm font-medium leading-none text-center self-stretch my-auto">
                  Delete Account
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[rgba(17,17,17,1)] border border-[rgba(255,71,156,0.6)] rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl text-white font-semibold mb-4">Confirm Account Deletion</h3>
              <p className="text-[rgba(153,153,153,1)] mb-4">
                This action cannot be undone. This will permanently delete your account and remove all associated data.
              </p>
              <p className="text-[rgba(153,153,153,1)] mb-4">
                Please type <strong className="text-red-400">DELETE</strong> to confirm:
              </p>
              
              <form onSubmit={(e) => { e.preventDefault(); handleDeleteAccount(); }}>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE here"
                  className="w-full bg-transparent border border-[rgba(74,85,101,1)] rounded px-3 py-2 text-white focus:outline-none focus:border-[rgba(255,71,156,1)] transition-colors mb-4"
                  disabled={isDeleting}
                />
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={confirmText !== 'DELETE' || isDeleting}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Account'}
                  </button>
                  <button
                    type="button"
                    onClick={closeDeleteDialog}
                    disabled={isDeleting}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};