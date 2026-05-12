import React, { useState, useRef, useEffect } from 'react';
import { groups as allGroups } from '../data/database';
import './AddEventModal.css';

const AddEventModal = ({ isOpen, onClose, onSave, defaultDate }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: defaultDate || '',
    start_time: '00:00',
    end_time: '00:00',
    groups: [],
    author: 'Фамилия Имя Отчество',
    comment: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showGroupsDropdown, setShowGroupsDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Фильтрованные группы в соответствии с поиском
  const filteredGroups = allGroups.filter(group =>
    group.name.includes(searchQuery) || searchQuery === ''
  );

  // Уже выбранные группы
  const selectedGroupNames = formData.groups.map(gId => 
    allGroups.find(g => g.id === gId)?.name || ''
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e) => {
    setFormData(prev => ({
      ...prev,
      date: e.target.value,
    }));
  };

  const handleTimeChange = (type, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleGroupSelect = (groupId) => {
    setFormData(prev => {
      const groups = prev.groups.includes(groupId)
        ? prev.groups.filter(id => id !== groupId)
        : [...prev.groups, groupId];
      return { ...prev, groups };
    });
  };

  const handleRemoveGroup = (groupId) => {
    setFormData(prev => ({
      ...prev,
      groups: prev.groups.filter(id => id !== groupId),
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Пожалуйста, введите название мероприятия');
      return;
    }
    if (formData.groups.length === 0) {
      alert('Пожалуйста, выберите хотя бы одну группу');
      return;
    }
    onSave(formData);
    setFormData({
      name: '',
      location: '',
      date: defaultDate || '',
      start_time: '00:00',
      end_time: '00:00',
      groups: [],
      author: 'Фамилия Имя Отчество',
      comment: '',
    });
    setSearchQuery('');
  };

  const handleClose = () => {
    setFormData({
      name: '',
      location: '',
      date: defaultDate || '',
      start_time: '00:00',
      end_time: '00:00',
      groups: [],
      author: 'Фамилия Имя Отчество',
      comment: '',
    });
    setSearchQuery('');
    onClose();
  };

  // Закрывать dropdown при клике вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowGroupsDropdown(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="add-event-modal-overlay" onClick={handleClose}>
      <div className="add-event-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Мероприятие</h2>

        {/* Date and Time Selection */}
        <div className="modal-controls">
          <input
            type="text"
            value={formData.date}
            onChange={handleDateChange}
            placeholder="ДД.МММ.ГГГГ"
            className="modal-date-input"
          />
          <div className="time-inputs">
            <input
              type="time"
              value={formData.start_time}
              onChange={(e) => handleTimeChange('start_time', e.target.value)}
              className="modal-time-input"
            />
            <span>-</span>
            <input
              type="time"
              value={formData.end_time}
              onChange={(e) => handleTimeChange('end_time', e.target.value)}
              className="modal-time-input"
            />
          </div>
        </div>

        {/* Event Name */}
        <div className="modal-form-group">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Добавьте название"
            className="modal-input"
          />
        </div>

        {/* Location */}
        <div className="modal-form-group">
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Добавьте место проведения"
            className="modal-input"
          />
        </div>

        {/* Groups Selection */}
        <div className="modal-form-group">
          <div className="groups-selector" ref={dropdownRef}>
            <div
              className="groups-input"
              onClick={() => setShowGroupsDropdown(!showGroupsDropdown)}
            >
              {selectedGroupNames.length > 0 ? (
                <div className="selected-groups">
                  {selectedGroupNames.map((name, idx) => (
                    <span key={idx} className="group-tag">
                      {name}
                      <button
                        className="remove-group-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveGroup(formData.groups[idx]);
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <span className="placeholder">Добавьте группы</span>
              )}
            </div>

            {showGroupsDropdown && (
              <div className="groups-dropdown">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск группы"
                  className="groups-search"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="groups-list">
                  {filteredGroups.length > 0 ? (
                    filteredGroups.map(group => (
                      <div
                        key={group.id}
                        className="group-item"
                        onClick={() => handleGroupSelect(group.id)}
                      >
                        <input
                          type="checkbox"
                          checked={formData.groups.includes(group.id)}
                          onChange={() => {}}
                          className="group-checkbox"
                        />
                        <span>{group.name}</span>
                      </div>
                    ))
                  ) : (
                    <div className="no-groups">Группы не найдены</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Author */}
        <div className="modal-author">
          <strong>Автор</strong> {formData.author}
        </div>

        {/* Comment */}
        <div className="modal-form-group">
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            placeholder="Комментарий к мероприятию"
            className="modal-textarea"
          />
        </div>

        {/* Buttons */}
        <div className="modal-buttons">
          <button className="modal-btn-cancel" onClick={handleClose}>
            Отмена
          </button>
          <button className="modal-btn-save" onClick={handleSave}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;
