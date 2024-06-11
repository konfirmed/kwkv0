// dashboard/speculation/page.tsx
import ApplySpeculationRulesForm from '../../../components/ApplySpeculationRulesForm';

const SpeculationRulesPage = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Speculation Rules API</h1>
      <ApplySpeculationRulesForm />
    </div>
  );
};

export default SpeculationRulesPage;
