import Doctors from "../Doctors"; 

export default function DoctorSearch() {
  return (
    <div>
      <h3>Search Doctors</h3>
      <Doctors searchPlaceholder="Search by name or specialization" showBookingButton={false} />
    </div>
  );
}
