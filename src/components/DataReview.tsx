import React, { useState } from 'react';
import { Edit3, Plus, Trash2, Save, X, Camera, Upload } from 'lucide-react';
import { ResumeData, Experience, Education, Skill, Certification, Language } from '../types/resume';

interface DataReviewProps {
  resumeData: ResumeData;
  onDataUpdate: (data: ResumeData) => void;
  onNext: () => void;
  onBack: () => void;
}

export const DataReview: React.FC<DataReviewProps> = ({
  resumeData,
  onDataUpdate,
  onNext,
  onBack
}) => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [localData, setLocalData] = useState<ResumeData>(resumeData);

  const handleSave = () => {
    onDataUpdate(localData);
    setEditingSection(null);
  };

  const handleCancel = () => {
    setLocalData(resumeData);
    setEditingSection(null);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoUrl = e.target?.result as string;
        setLocalData({
          ...localData,
          personalInfo: {
            ...localData.personalInfo,
            photo: photoUrl
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      position: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ['']
    };
    setLocalData({
      ...localData,
      experience: [...localData.experience, newExp]
    });
  };

  const removeExperience = (id: string) => {
    setLocalData({
      ...localData,
      experience: localData.experience.filter(exp => exp.id !== id)
    });
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setLocalData({
      ...localData,
      experience: localData.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 'Intermediate'
    };
    setLocalData({
      ...localData,
      skills: [...localData.skills, newSkill]
    });
  };

  const removeSkill = (id: string) => {
    setLocalData({
      ...localData,
      skills: localData.skills.filter(skill => skill.id !== id)
    });
  };

  const addLanguage = () => {
    const newLanguage: Language = {
      id: Date.now().toString(),
      name: '',
      level: 'Intermediate'
    };
    setLocalData({
      ...localData,
      languages: [...(localData.languages || []), newLanguage]
    });
  };

  const removeLanguage = (id: string) => {
    setLocalData({
      ...localData,
      languages: (localData.languages || []).filter(lang => lang.id !== id)
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Edit Your Information</h2>
          <p className="text-gray-600">Make sure all your information is accurate and complete.</p>
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              <button
                onClick={() => setEditingSection(editingSection === 'personal' ? null : 'personal')}
                className="text-blue-500 hover:text-blue-600 flex items-center"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </button>
            </div>
            <div className="p-6">
              {editingSection === 'personal' ? (
                <div className="space-y-4">
                  {/* Photo Upload */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {localData.personalInfo.photo ? (
                        <img 
                          src={localData.personalInfo.photo} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Photo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={localData.personalInfo.name}
                        onChange={(e) => setLocalData({
                          ...localData,
                          personalInfo: { ...localData.personalInfo, name: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={localData.personalInfo.title}
                        onChange={(e) => setLocalData({
                          ...localData,
                          personalInfo: { ...localData.personalInfo, title: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={localData.personalInfo.email}
                        onChange={(e) => setLocalData({
                          ...localData,
                          personalInfo: { ...localData.personalInfo, email: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={localData.personalInfo.phone}
                        onChange={(e) => setLocalData({
                          ...localData,
                          personalInfo: { ...localData.personalInfo, phone: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={localData.personalInfo.location}
                        onChange={(e) => setLocalData({
                          ...localData,
                          personalInfo: { ...localData.personalInfo, location: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                      <input
                        type="url"
                        value={localData.personalInfo.linkedin}
                        onChange={(e) => setLocalData({
                          ...localData,
                          personalInfo: { ...localData.personalInfo, linkedin: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start space-x-6">
                  {/* Photo Display */}
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {localData.personalInfo.photo ? (
                      <img 
                        src={localData.personalInfo.photo} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Personal Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    <div>
                      <span className="text-sm text-gray-500">Name:</span>
                      <p className="font-medium">{localData.personalInfo.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Title:</span>
                      <p className="font-medium">{localData.personalInfo.title}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Email:</span>
                      <p className="font-medium">{localData.personalInfo.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Phone:</span>
                      <p className="font-medium">{localData.personalInfo.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Location:</span>
                      <p className="font-medium">{localData.personalInfo.location}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">LinkedIn:</span>
                      <p className="font-medium">{localData.personalInfo.linkedin}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Professional Summary</h3>
              <button
                onClick={() => setEditingSection(editingSection === 'summary' ? null : 'summary')}
                className="text-blue-500 hover:text-blue-600 flex items-center"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </button>
            </div>
            <div className="p-6">
              {editingSection === 'summary' ? (
                <div className="space-y-4">
                  <textarea
                    value={localData.summary}
                    onChange={(e) => setLocalData({ ...localData, summary: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write a compelling summary of your professional background..."
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 leading-relaxed">{localData.summary}</p>
              )}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
              <div className="flex space-x-2">
                <button
                  onClick={addExperience}
                  className="text-green-500 hover:text-green-600 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </button>
                <button
                  onClick={() => setEditingSection(editingSection === 'experience' ? null : 'experience')}
                  className="text-blue-500 hover:text-blue-600 flex items-center"
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  Edit
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {localData.experience.map((exp, index) => (
                  <div key={exp.id} className="border-l-2 border-gray-200 pl-4">
                    {editingSection === 'experience' ? (
                      <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                            <input
                              type="text"
                              placeholder="Position"
                              value={exp.position}
                              onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="Company"
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="Location"
                              value={exp.location}
                              onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                placeholder="Start Date"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                              <input
                                type="text"
                                placeholder="End Date"
                                value={exp.endDate}
                                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => removeExperience(exp.id)}
                            className="text-red-500 hover:text-red-600 ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          placeholder="Job description..."
                          value={exp.description.join('\n')}
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value.split('\n'))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                            <p className="text-blue-600 font-medium">{exp.company}</p>
                            {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                          </div>
                          <span className="text-sm text-gray-500">
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </span>
                        </div>
                        <ul className="text-gray-700 space-y-1">
                          {exp.description.map((desc, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-gray-400 mr-2">•</span>
                              {desc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {editingSection === 'experience' && (
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleSave}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
              <div className="flex space-x-2">
                <button
                  onClick={addSkill}
                  className="text-green-500 hover:text-green-600 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </button>
                <button
                  onClick={() => setEditingSection(editingSection === 'skills' ? null : 'skills')}
                  className="text-blue-500 hover:text-blue-600 flex items-center"
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  Edit
                </button>
              </div>
            </div>
            <div className="p-6">
              {editingSection === 'skills' ? (
                <div className="space-y-3">
                  {localData.skills.map((skill) => (
                    <div key={skill.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                      <input
                        type="text"
                        placeholder="Skill name"
                        value={skill.name}
                        onChange={(e) => setLocalData({
                          ...localData,
                          skills: localData.skills.map(s =>
                            s.id === skill.id ? { ...s, name: e.target.value } : s
                          )
                        })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <select
                        value={skill.level}
                        onChange={(e) => setLocalData({
                          ...localData,
                          skills: localData.skills.map(s =>
                            s.id === skill.id ? { ...s, level: e.target.value as any } : s
                          )
                        })}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                      <button
                        onClick={() => removeSkill(skill.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleSave}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {localData.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill.name} ({skill.level})
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Languages */}
          {localData.languages && localData.languages.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Languages</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={addLanguage}
                    className="text-green-500 hover:text-green-600 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </button>
                  <button
                    onClick={() => setEditingSection(editingSection === 'languages' ? null : 'languages')}
                    className="text-blue-500 hover:text-blue-600 flex items-center"
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                </div>
              </div>
              <div className="p-6">
                {editingSection === 'languages' ? (
                  <div className="space-y-3">
                    {localData.languages.map((language) => (
                      <div key={language.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                        <input
                          type="text"
                          placeholder="Language"
                          value={language.name}
                          onChange={(e) => setLocalData({
                            ...localData,
                            languages: localData.languages!.map(l =>
                              l.id === language.id ? { ...l, name: e.target.value } : l
                            )
                          })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Proficiency Level"
                          value={language.level}
                          onChange={(e) => setLocalData({
                            ...localData,
                            languages: localData.languages!.map(l =>
                              l.id === language.id ? { ...l, level: e.target.value } : l
                            )
                          })}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          onClick={() => removeLanguage(language.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={handleSave}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {localData.languages.map((language) => (
                      <span
                        key={language.id}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {language.name} ({language.level})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => {
              onDataUpdate(localData);
              onNext();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Choose Template
          </button>
        </div>
      </div>
    </div>
  );
};