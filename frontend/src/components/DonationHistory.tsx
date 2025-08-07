import { useConfidentialDonationContract } from "../hooks/useConfidentialDonationContract";

const DonationHistory = () => {
  const { donations, isLoadingDonations, donationError } = useConfidentialDonationContract();

  if (isLoadingDonations) return <p>Loading donations...</p>;
  if (donationError) return <p>Error loading donations.</p>;

  return (
    <div>
      <h2>Your Donation History</h2>
      {donations && donations.length > 0 ? (
        <ul>
          {donations.map((amount, index) => (
            <li key={index}>Donation {index + 1}: {BigInt(amount).toString()} wei</li>
          ))}
        </ul>
      ) : (
        <p>No donations yet.</p>
      )}
    </div>
  );
};

export default DonationHistory;
