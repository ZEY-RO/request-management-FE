import { useState, useEffect } from 'react';

export default function RequestForm({
  initialData = null,
  onSubmit,
  submitButtonText = 'Submit',
  isLoading = false,
  error = '',
  success = false,
  onCancel
}) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [status, setStatus] = useState(initialData?.status ?? 'pending');
  const [priority, setPriority] = useState(initialData?.priority ?? 'low');

  useEffect(() => {
    if (!initialData) return;

    setTitle(initialData.title ?? '');
    setDescription(initialData.description ?? '');
    setStatus(initialData.status ?? 'pending');
    setPriority(initialData.priority ?? 'low');
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, status, priority });
  };

  return (
    <form onSubmit={handleSubmit} className="request-form">
      {error && <div className="request-form__error">{error}</div>}
      {success && <div className="request-form__success">Success! Redirecting to requests...</div>}

      <div className="request-form__field">
        <label htmlFor="title" className="request-form__label">
          Title <span className="request-form__required">*</span>
        </label>
        <input
          id="title"
          type="text"
          className="request-form__input"
          placeholder="A brief, descriptive title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="request-form__field">
        <label htmlFor="description" className="request-form__label">
          Description <span className="request-form__required">*</span>
        </label>
        <textarea
          id="description"
          className="request-form__textarea"
          placeholder="Describe your request in detail…"
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="request-form__field">
        <label htmlFor="priority" className="request-form__label">
          Priority <span className="request-form__required">*</span>
        </label>
        <select
          id="priority"
          className="request-form__select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          required
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="request-form__field">
        <label htmlFor="status" className="request-form__label">
          Status <span className="request-form__required">*</span>
        </label>
        <select
          id="status"
          className="request-form__select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="request-form__actions">
        <button
          type="submit"
          className="request-form__btn request-form__btn--submit"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting…' : submitButtonText}
        </button>
        {onCancel && (
          <button
            type="button"
            className="request-form__btn request-form__btn--cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
