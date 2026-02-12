import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestService } from '../services/requestService';
import Navbar from '../components/Navbar';
import RequestForm from '../components/RequestForm';
import './CreateRequestPage.css';
import '../components/RequestForm.css';

export default function CreateRequestPage() {
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await requestService.create({ title, description, status, priority });
      setSuccess(true);
      setTitle('');
      setDescription('');
      setStatus('pending');
      setPriority('low');
      setTimeout(() => {
        navigate(`/requests`);
      }, 2000);
    } catch (err) {
      const message =
        err.response?.data?.errors?.join(', ') || 'Failed to create request.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-page">
      <Navbar />

      <main className="create-page__main">
        <h1 className="create-page__title">New Request</h1>
        <p className="create-page__subtitle">
          Fill out the form below to submit a new request
        </p>

        <RequestForm
          onSubmit={async (data) => {
            setError('');
            setIsLoading(true);
            try {
              await requestService.create(data);
              setSuccess(true);
              setTimeout(() => {
                navigate(`/requests`);
              }, 2000);
            } catch (err) {
              const message =
                err.response?.data?.errors?.join(', ') || 'Failed to create request.';
              setError(message);
            } finally {
              setIsLoading(false);
            }
          }}
          submitButtonText="Submit Request"
          isLoading={isLoading}
          error={error}
          success={success}
          onCancel={() => navigate('/requests')}
        />
      </main>
    </div>
  );
}
