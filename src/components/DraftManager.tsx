Here's the fixed version with all missing closing brackets added:

```typescript
// ... [previous code remains the same until the debug footer section]
              {/* Debug footer */}
              <div className="text-xs text-gray-400 mt-1">
                Debug: Drafts={drafts.length}, Loading={isLoading}, Error={!!error}
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              disabled={isLoading}
            >
              {t('app.buttons.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

The main issue was in the debug footer section where a closing parenthesis was misplaced. I've fixed it by properly closing the JSX elements.