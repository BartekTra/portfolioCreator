import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Plus, Trash2, Facebook, Instagram, Twitter, Github, Linkedin, Youtube, Twitch, Globe } from "lucide-react";

const SOCIAL_MEDIA_PLATFORMS = [
  { 
    key: "facebook", 
    icon: Facebook, 
    validate: (url) => url.toLowerCase().includes("facebook.com") || url.toLowerCase().includes("fb.com"),
    domains: ["facebook.com", "fb.com"]
  },
  { 
    key: "instagram", 
    icon: Instagram, 
    validate: (url) => url.toLowerCase().includes("instagram.com"),
    domains: ["instagram.com"]
  },
  { 
    key: "twitter", 
    icon: Twitter, 
    validate: (url) => url.toLowerCase().includes("twitter.com") || url.toLowerCase().includes("x.com"),
    domains: ["twitter.com", "x.com"]
  },
  { 
    key: "github", 
    icon: Github, 
    validate: (url) => url.toLowerCase().includes("github.com"),
    domains: ["github.com"]
  },
  { 
    key: "linkedin", 
    icon: Linkedin, 
    validate: (url) => url.toLowerCase().includes("linkedin.com"),
    domains: ["linkedin.com"]
  },
  { 
    key: "youtube", 
    icon: Youtube, 
    validate: (url) => url.toLowerCase().includes("youtube.com") || url.toLowerCase().includes("youtu.be"),
    domains: ["youtube.com", "youtu.be"]
  },
  { 
    key: "tiktok", 
    icon: "./assets/tiktok.png", 
    validate: (url) => url.toLowerCase().includes("tiktok.com"),
    domains: ["tiktok.com"]
  },
  { 
    key: "snapchat", 
    icon: "./assets/snapchat.png", 
    validate: (url) => url.toLowerCase().includes("snapchat.com"),
    domains: ["snapchat.com"]
  },
  { 
    key: "pinterest", 
    icon: "./assets/pinterest.png", 
    validate: (url) => url.toLowerCase().includes("pinterest.com"),
    domains: ["pinterest.com"]
  },
  { 
    key: "twitch", 
    icon: Twitch, 
    validate: (url) => url.toLowerCase().includes("twitch.tv"),
    domains: ["twitch.tv"]
  },
  { 
    key: "other", 
    icon: Globe, 
    validate: () => true,
    domains: []
  },
];

function SocialMediaPicker({ initialValue = [], onSave, onCancel }) {
  const { t } = useTranslation();
  const [socialLinks, setSocialLinks] = useState(() => {
    if (Array.isArray(initialValue) && initialValue.length > 0) {
      return initialValue;
    }
    return [];
  });

  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState({});

  const validateUrl = (platformKey, urlValue) => {
    if (!urlValue.trim()) {
      return t("titlePages.socialMedia.errors.emptyUrl");
    }

    try {
      new URL(urlValue);
    } catch (e) {
      return t("titlePages.socialMedia.errors.invalidUrl");
    }

    const platform = SOCIAL_MEDIA_PLATFORMS.find(p => p.key === platformKey);
    if (platform && !platform.validate(urlValue)) {
      return t("titlePages.socialMedia.errors.wrongPlatform", { 
        platform: t(`titlePages.socialMedia.platforms.${platformKey}`) 
      });
    }

    return null;
  };

  const addSocialLink = () => {
    if (!selectedPlatform || !url.trim()) {
      setErrors({ url: t("titlePages.socialMedia.errors.fillAllFields") });
      return;
    }

    const error = validateUrl(selectedPlatform, url);
    if (error) {
      setErrors({ url: error });
      return;
    }

    if (socialLinks.some(link => link.platform === selectedPlatform)) {
      setErrors({ url: t("titlePages.socialMedia.errors.platformExists") });
      return;
    }

    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    const newLink = {
      platform: selectedPlatform,
      url: normalizedUrl,
    };

    setSocialLinks([...socialLinks, newLink]);
    setSelectedPlatform("");
    setUrl("");
    setErrors({});
  };

  const removeSocialLink = (index) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(socialLinks);
  };

  const handleUrlChange = (value) => {
    setUrl(value);
    if (errors.url) {
      setErrors({});
    }
  };

  const handlePlatformChange = (value) => {
    setSelectedPlatform(value);
    if (errors.url) {
      setErrors({});
    }
  };

  const getPlatformIcon = (platformKey) => {
    const platform = SOCIAL_MEDIA_PLATFORMS.find(p => p.key === platformKey);
    if (platform) {
      const IconComponent = platform.icon;
      return <IconComponent size={20} />;
    }
    return <Globe size={20} />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {t("titlePages.socialMedia.title")}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Formularz dodawania nowego linku */}
          <div className="space-y-4 border-b border-gray-200 dark:border-gray-700 pb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("titlePages.socialMedia.selectPlatform")}
              </label>
              <select
                value={selectedPlatform}
                onChange={(e) => handlePlatformChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
              >
                <option value="">{t("titlePages.socialMedia.choosePlatform")}</option>
                {SOCIAL_MEDIA_PLATFORMS.map((platform) => {
                  const IconComponent = platform.icon;
                  return (
                    <option key={platform.key} value={platform.key}>
                      {t(`titlePages.socialMedia.platforms.${platform.key}`)}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("titlePages.socialMedia.url")}
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder={t("titlePages.socialMedia.urlPlaceholder")}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 ${
                  errors.url
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.url && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.url}</p>
              )}
            </div>

            <button
              onClick={addSocialLink}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus size={20} />
              <span>{t("titlePages.socialMedia.add")}</span>
            </button>
          </div>

          {/* Lista dodanych linków */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              {t("titlePages.socialMedia.addedLinks")}
            </h3>
            {socialLinks.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {t("titlePages.socialMedia.noLinks")}
              </p>
            ) : (
              <div className="space-y-2">
                {socialLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 text-gray-600 dark:text-gray-300">
                        {getPlatformIcon(link.platform)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                          {t(`titlePages.socialMedia.platforms.${link.platform}`)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {link.url}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeSocialLink(index)}
                      className="ml-4 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      title={t("common.delete")}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Przyciski akcji */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {t("common.save")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SocialMediaPicker;

