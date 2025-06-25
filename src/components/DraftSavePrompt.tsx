import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface DraftSavePromptProps {
  isOpen: boolean;
  onSave: (name: string) => void;
  onSkip: () => void;
  onCancel: () => void;
  defaultName?: string;
}

export const DraftSavePrompt: React.FC<DraftSavePromptProps> = ({
  isOpen,
  onSave,
  onSkip,
  onCancel,
  defaultName = ''
}) => {
  const { t } = useTranslation();
  const [draftName, setDraftName] = useState(defaultName);

  if (!isOpen) return null;

  const handleSave = () => {
    if (draftName.trim()) {
      onSave(draftName.trim());
      setDraftName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('draftSavePrompt.title')}</h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-gray-600 mb-4">
            {t('draftSavePrompt.description')}
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('draftSavePrompt.form.nameLabel')}
            </label>
            <input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder={t('draftSavePrompt.form.namePlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              disabled={!draftName.trim()}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {t('draftSavePrompt.buttons.saveDraft')}
            </button>
            <button
              onClick={onSkip}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              {t('draftSavePrompt.buttons.skip')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};