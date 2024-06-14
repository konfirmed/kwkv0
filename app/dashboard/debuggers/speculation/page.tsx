// dashboard/speculation/page.tsx
import ApplySpeculationRulesForm from '../../../../components/speculation/ApplySpeculationRulesForm';

const SpeculationRulesPage = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 className="text-xl font-semibold text-[#5d534a]">Speculation rules API</h2>
      <ApplySpeculationRulesForm />
    </div>
  );
};

export default SpeculationRulesPage;