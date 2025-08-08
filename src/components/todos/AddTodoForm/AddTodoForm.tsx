import React, { useState, useEffect } from 'react';
import { Plus, XCircle, CheckCircle } from 'lucide-react';
import { useAddTodoMutation } from '../../../api/todoApi';
import styles from './AddTodoForm.module.css';

const AddTodoForm: React.FC = () => {
  const [newTodo, setNewTodo] = useState({ title: '' });
  const [addTodoMutation, { isLoading: isAdding, isSuccess: addSuccess, isError: addError, reset }] = useAddTodoMutation();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (addSuccess || addError) {
      setShowPopup(true);
      const timer = setTimeout(() => {
        setShowPopup(false);
        reset();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [addSuccess, addError, reset]);

  const addTodo = async () => {
    if (!newTodo.title.trim()) return;
    await addTodoMutation({
      title: newTodo.title,
      status: 'todo',
    });
    setNewTodo({ title: '' });
  };

  const popupClasses = `${styles.popup} ${addSuccess ? styles.popupSuccess : styles.popupError}`;

  return (
    <div className={styles.formWrapper}>
      <h2 className={styles.formTitle}>Нове завдання</h2>
      <div className={styles.formFields}>
        <input
          className={styles.formInput}
          type="text"
          placeholder="Назва завдання"
          value={newTodo.title}
          onChange={(e) => setNewTodo((prev) => ({ ...prev, title: e.target.value }))}
        />
        <div className={styles.buttonGroup}>
          <button className={styles.addButton} onClick={addTodo} disabled={isAdding || !newTodo.title.trim()}>
            <Plus className="w-4 h-4" />
            Додати завдання
          </button>
          {isAdding && <div className={styles.spinner} />}
        </div>
      </div>

      {showPopup && (
        <div className={popupClasses}>
          {addSuccess ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span>{addSuccess ? 'Завдання успішно додано!' : 'Помилка додавання!'}</span>
        </div>
      )}
    </div>
  );
};

export default AddTodoForm;
